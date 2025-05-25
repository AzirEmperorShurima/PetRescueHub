import { uploadToFolder, getOrCreateNestedFolders, getOrCreatePostTypeFolder } from '../services/upload/GoogleDrive.service.js';
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
 * 📦 Tạo middleware để xử lý upload ảnh vào thư mục theo cấu hình
 * 
 * Middleware này trích xuất file từ `req.files`, xác thực người dùng, xác định thư mục đích,
 * upload ảnh, và gán danh sách URL ảnh đã upload vào `req.uploadedImageUrls`.
 * 
 * Hỗ trợ cấu trúc thư mục dạng: `userId/folderType/customFolderName`
 * 
 * @function createUploader
 * 
 * @param {Object} config - Cấu hình middleware upload
 * @param {String} config.folderType - Loại thư mục gốc cần tạo (ví dụ: 'postImage', 'petAlbum', 'album', ...)
 * @param {Boolean} [config.usePostTypeFolder=false] - Có tạo thư mục con bên trong folderType không (dựa theo `postType`, `customFolderName`, hoặc `albumName`)
 * @param {String} [config.customFolderName] - Tên thư mục con tùy chỉnh (ưu tiên cao nhất)
 * @param {String} [config.defaultPostType='rawFolder'] - Tên mặc định nếu không có `postType` trong request
 * @param {Boolean} [config.skipIfEmpty=false] - Nếu true, sẽ bỏ qua xử lý nếu không có file nào trong request
 * 
 * @returns {Function} Middleware function `(req, res, next)` để sử dụng trong Express
 * 
 * @example
 * // Upload ảnh vào thư mục userId/petAlbum/cat
 * app.post('/upload', uploadPetAlbumImages('petAlbum', 'cat'));
 * 
 * @example
 * // Upload ảnh vào thư mục userId/postImage/ForumPost
 * app.post('/upload', uploadPostImages);
 * 
 * @example
 * // Upload ảnh tùy chọn vào userId/customFolderName
 * app.post('/upload', uploadCustom('myUploads', '2025-Photos'));
 */
export const createUploader = (config) => {
    const {
        folderType,
        usePostTypeFolder = false,
        customFolderName,
        defaultPostType = "rawFolder",
        skipIfEmpty
    } = config;

    const extractFiles = (req) => {
        if (Array.isArray(req.files)) return req.files;
        if (typeof req.files === 'object' && req.files !== null) {
            return Object.values(req.files).flat();
        }
        return [];
    };
    return async (req, res, next) => {
        try {
            const files = extractFiles(req);

            // ✅ Nếu không có ảnh và cấu hình cho phép bỏ qua
            if (files.length === 0 && skipIfEmpty) {
                req.uploadedImageUrls = [];
                return next();
            }

            const userId = req.user?._id;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized: Yêu cầu xác thực' });
            }

            const postType = req.postType || defaultPostType
            const albumId = req.albumId || req.body.albumId;
            const albumName = req.albumName || req.body.albumName;

            const folders = await getOrCreateNestedFolders(userId);
            const rootFolderId = folders[folderType];
            if (!rootFolderId) {
                return res.status(500).json({ success: false, message: `Không tìm thấy thư mục ${folderType}` });
            }

            // === Xác định thư mục upload ===
            let uploadFolderId;

            if (usePostTypeFolder === false) {
                uploadFolderId = rootFolderId;
            } else if (customFolderName) {
                uploadFolderId = await getOrCreatePostTypeFolder(rootFolderId, customFolderName);
            } else if (albumId || albumName) {
                const albumFolderName = albumName || `Album_${albumId}`;
                uploadFolderId = await getOrCreatePostTypeFolder(rootFolderId, albumFolderName);
            } else {
                uploadFolderId = await getOrCreatePostTypeFolder(rootFolderId, postType);
            }

            // === Upload từng file ===
            const uploadPromises = files.map(file => uploadWithRetry(file, uploadFolderId));
            const results = await Promise.allSettled(uploadPromises);

            const uploadedImageUrls = [], errors = [];
            results.forEach((res, i) => {
                if (res.status === 'fulfilled' && res.value.success) {
                    uploadedImageUrls.push(res.value.fileUrl);
                } else {
                    errors.push({ file: files[i].originalname, error: res.reason?.message });
                }
            });

            req.uploadedImageUrls = uploadedImageUrls;

            if (errors.length > 0) {
                return res.status(207).json({
                    success: false,
                    message: 'Một số ảnh không upload được',
                    uploadedImageUrls,
                    errors
                });
            }

            return next();
        } catch (err) {
            console.error(`❌ Lỗi upload ảnh:`, err);
            return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
        }
    };
};

// Upload cho album thú cưng
export const uploadPetAlbumImages = (folderType = 'petAlbum') => createUploader(
    {
        folderType,
        // customFolderName: customName,
        usePostTypeFolder: false,
        skipIfEmpty: true
    }
);
// Upload cho post
export const uploadPostImages = () => createUploader({
    folderType: 'postImage',
    usePostTypeFolder: true,
    defaultPostType: 'ForumPost',
    skipIfEmpty: true
});


// Upload cho album người dùng
export const uploadAlbumImages = () => createUploader({
    folderType: 'album',
    usePostTypeFolder: false,
    skipIfEmpty: true
});

// Upload ảnh vào thư mục bất kỳ
export const uploadCustom = (folderType, customName) => createUploader({
    folderType,
    customFolderName: customName,
    usePostTypeFolder: false,
    skipIfEmpty: true
});
