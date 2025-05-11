import multer from 'multer';
import { uploadToFolder, getOrCreateNestedFolders, getOrCreatePostTypeFolder } from '../services/upload/GoogleDrive.service.js';
import { COOKIE_PATHS } from '../../config.js';
import { getUserFieldFromToken } from '../services/User/User.service.js';

// Cấu hình multer
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận các định dạng ảnh: JPG, PNG, GIF, WEBP'), false);
        }
    }
});

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

/**
 * Middleware upload nhiều ảnh, không giới hạn số lượng
 * @param {string} fieldName - Tên trường chứa danh sách ảnh (mặc định: 'images')
 * @param {string} folderType - Loại thư mục upload (album, postImage, petAlbum)
 */
export const uploadPostImages = (fieldName = 'images', folderType = 'postImage') => {
    return [
        upload.array(fieldName),
        async (req, res, next) => {
            try {
                if (!req.files || req.files.length === 0) {
                    req.uploadedImageUrls = [];
                    return next();
                }

                const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        message: 'Yêu cầu xác thực người dùng'
                    });
                }

                // Lấy postType từ request body
                const postType = req.body.postType || 'ForumPost';

                const folders = await getOrCreateNestedFolders(userId);
                const targetFolderId = folders[folderType];

                if (!targetFolderId) {
                    return res.status(500).json({
                        success: false,
                        message: `Thư mục ${folderType} không tồn tại`
                    });
                }

                // Tạo hoặc lấy thư mục con theo postType
                const postTypeFolder = await getOrCreatePostTypeFolder(targetFolderId, postType);
                if (!postTypeFolder) {
                    return res.status(500).json({
                        success: false,
                        message: `Không thể tạo thư mục cho ${postType}`
                    });
                }

                console.log(`📤 Bắt đầu upload ${req.files.length} ảnh cho user ${userId} vào thư mục ${postType}`);
                const uploadPromises = req.files.map(file =>
                    uploadWithRetry(file, postTypeFolder)
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
        }
    ];
};