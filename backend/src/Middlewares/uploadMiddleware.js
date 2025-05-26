import { uploadToFolder, getOrCreateNestedFolders, getOrCreatePostTypeFolder } from '../services/upload/GoogleDrive.service.js';

// Hàm retry cho upload
const uploadWithRetry = async (file, folderId, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const result = await uploadToFolder(file, folderId);
            if (result.success) return result;
            throw new Error(result.message);
        } catch (error) {
            if (attempt === retries) {
                console.error(`❌ Thất bại sau ${retries} lần thử: ${file.originalname}`);
                throw error;
            }
            console.warn(`⚠️ Thử lại (${attempt}/${retries}): ${file.originalname}`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

// Cấu hình mặc định cho các loại upload khác nhau
const UPLOAD_CONFIGS = {
    forumPost: {
        folderType: 'postImage',
        defaultPostType: 'ForumPost',
        usePostTypeFolder: true,
        customFolderName: null
    },
    userAlbum: {
        folderType: 'album',
        defaultPostType: 'Album',
        usePostTypeFolder: false,
        customFolderName: null
    },
    petAlbum: {
        folderType: 'petAlbum',
        defaultPostType: 'PetAlbum',
        usePostTypeFolder: false,
        customFolderName: null
    }
};

/**
 * Middleware upload nhiều ảnh, không giới hạn số lượng
 * @param {Object} config - Cấu hình cho việc upload
 * @param {string} config.folderType - Loại thư mục upload (album, postImage, petAlbum)
 * @param {string} config.defaultPostType - Loại bài đăng mặc định nếu không có trong request
 * @param {boolean} config.usePostTypeFolder - Có sử dụng thư mục con theo postType hay không
 * @param {string} config.customFolderName - Tên thư mục tùy chỉnh (thay vì dùng postType)
 * @param {string} config.uploadType - Loại upload từ cấu hình có sẵn (forumPost, userAlbum, petAlbum)
 */
export const uploadPostImages = (config = {}) => {
    // Nếu có uploadType, sử dụng cấu hình có sẵn
    if (config.uploadType && UPLOAD_CONFIGS[config.uploadType]) {
        config = { ...UPLOAD_CONFIGS[config.uploadType], ...config };
        // Xóa uploadType để tránh xung đột
        delete config.uploadType;
    }
    
    // Đảm bảo có các giá trị mặc định
    config = {
        folderType: 'postImage',
        defaultPostType: 'ForumPost',
        usePostTypeFolder: true,
        customFolderName: null,
        ...config
    };
    
    return async (req, res, next) => {
        try {
            if (!req.files || req.files.length === 0) {
                req.uploadedImageUrls = [];
                return next();
            }

            const userId = req.user._id
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Yêu cầu xác thực người dùng'
                });
            }

            // Lấy postType từ request hoặc từ config
            const postType = req.postType || config.defaultPostType || 'ForumPost';
            
            // Lấy thông tin về album nếu có
            const albumId = req.albumId || req.body.albumId;
            const albumName = req.albumName || req.body.albumName;

            const folders = await getOrCreateNestedFolders(userId);
            const targetFolderId = folders[config.folderType];

            if (!targetFolderId) {
                return res.status(500).json({
                    success: false,
                    message: `Thư mục ${config.folderType} không tồn tại`
                });
            }

            let uploadFolderId;
            
            // Xác định thư mục upload dựa vào config
            if (config.usePostTypeFolder === false) {
                // Sử dụng trực tiếp targetFolderId nếu không cần thư mục con
                uploadFolderId = targetFolderId;
            } else if (config.customFolderName) {
                // Sử dụng tên thư mục tùy chỉnh
                const customFolder = await getOrCreatePostTypeFolder(targetFolderId, config.customFolderName);
                if (!customFolder) {
                    return res.status(500).json({
                        success: false,
                        message: `Không thể tạo thư mục ${config.customFolderName}`
                    });
                }
                uploadFolderId = customFolder;
            } else if (albumId || albumName) {
                // Tạo hoặc lấy thư mục album nếu có thông tin album
                const albumFolderName = albumName || `Album_${albumId}`;
                const albumFolder = await getOrCreatePostTypeFolder(targetFolderId, albumFolderName);
                if (!albumFolder) {
                    return res.status(500).json({
                        success: false,
                        message: `Không thể tạo thư mục cho album ${albumFolderName}`
                    });
                }
                uploadFolderId = albumFolder;
            } else {
                // Mặc định: Tạo hoặc lấy thư mục con theo postType
                const postTypeFolder = await getOrCreatePostTypeFolder(targetFolderId, postType);
                if (!postTypeFolder) {
                    return res.status(500).json({
                        success: false,
                        message: `Không thể tạo thư mục cho ${postType}`
                    });
                }
                uploadFolderId = postTypeFolder;
            }

            console.log(`📤 Bắt đầu upload ${req.files.length} ảnh cho user ${userId} vào thư mục ${config.customFolderName || albumName || postType}`);
            const uploadPromises = req.files.map(file =>
                uploadWithRetry(file, uploadFolderId)
            );

            const results = await Promise.allSettled(uploadPromises);

            const uploadedImageUrls = [];
            const errors = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value.success) {
                    uploadedImageUrls.push(result.value.fileUrl);
                    console.log(`✅ Upload thành công: ${req.files[index].originalname}`);
                } else {
                    const errorMsg = result.reason?.message || 'Lỗi không xác định';
                    errors.push({
                        file: req.files[index].originalname,
                        error: errorMsg
                    });
                    console.error(`❌ Upload thất bại: ${req.files[index].originalname} - ${errorMsg}`);
                }
            });

            if (errors.length > 0) {
                console.warn(`⚠️ Có ${errors.length} lỗi trong quá trình upload`);
                return res.status(207).json({
                    success: false,
                    message: 'Upload một phần thất bại',
                    uploadedImageUrls,
                    errors
                });
            }
            req.uploadedImageUrls = uploadedImageUrls;
            console.log(`🏁 Hoàn tất upload ${uploadedImageUrls.length} ảnh`);
            next();
        } catch (error) {
            console.error('❌ Lỗi server khi upload ảnh:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server khi upload ảnh',
                error: error.message
            });
        }
    };
};

// Các hàm tiện ích để sử dụng nhanh các cấu hình có sẵn
export const uploadForumImages = (customConfig = {}) => {
    return uploadPostImages({ uploadType: 'forumPost', ...customConfig });
};

export const uploadUserAlbumImages = (customConfig = {}) => {
    return uploadPostImages({ uploadType: 'userAlbum', ...customConfig });
};

export const uploadPetAlbumImages = (customConfig = {}) => {
    return uploadPostImages({ uploadType: 'petAlbum', ...customConfig });
};