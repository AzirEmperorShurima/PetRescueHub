import multer from 'multer';

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

// Middleware xử lý form data và file uploads
export const parseFormData = (fieldName = 'images') => {
    return upload.array(fieldName);
};