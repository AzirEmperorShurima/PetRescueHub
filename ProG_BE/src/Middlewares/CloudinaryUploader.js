import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../Config/Cloudinary.config.js';

const createCloudinaryStorage = (folder) =>
    new CloudinaryStorage({
        cloudinary,
        params: {
            folder,
            allowed_formats: process.env.CLOUDINARY_ALLOWED_FORMATS?.split(',') || ['jpg', 'png', 'jpeg'],
            // transformation: [
            //     {
            //         width: parseInt(process.env.CLOUDINARY_IMAGE_WIDTH) || 200,
            //         height: parseInt(process.env.CLOUDINARY_IMAGE_HEIGHT) || 200,
            //         crop: process.env.CLOUDINARY_CROP_MODE || 'fill',
            //     },
            // ],
        },
    });

const createMulter = (folder) => {
    const storage = createCloudinaryStorage(folder);
    const maxFileSize = parseInt(process.env.CLOUDINARY_MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB default
    const allowedFormats = process.env.CLOUDINARY_ALLOWED_FORMATS?.split(',') || ['jpg', 'png', 'jpeg'];
    
    return multer({
        storage,
        limits: { 
            fileSize: maxFileSize,
            files: 1 // Chỉ cho phép upload 1 file
        },
        fileFilter: (req, file, cb) => {
            // Kiểm tra mime type
            const mimeTypes = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png'
            };

            // Lấy extension từ tên file
            const extension = file.originalname.split('.').pop().toLowerCase();
            
            // Kiểm tra extension có được cho phép
            if (!allowedFormats.includes(extension)) {
                return cb(new Error(`Chỉ chấp nhận các file có định dạng: ${allowedFormats.join(', ')}`));
            }

            // Kiểm tra mime type có khớp với extension
            const expectedMimeType = mimeTypes[extension];
            if (file.mimetype !== expectedMimeType) {
                return cb(new Error('File không hợp lệ hoặc đã bị chỉnh sửa'));
            }

            // Kiểm tra kích thước file
            if (parseInt(req.headers['content-length']) > maxFileSize) {
                return cb(new Error(`Kích thước file không được vượt quá ${maxFileSize / (1024 * 1024)}MB`));
            }

            cb(null, true);
        },
    });
};

export const avatarUploadMiddleware = (folder = 'user_avatars') => {
    const upload = createMulter(folder).single('avatar');

    return (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message,
                });
            }

            if (req.file) {
                req.avatarUrl = req.file.path;
            }

            next();
        });
    };
};
