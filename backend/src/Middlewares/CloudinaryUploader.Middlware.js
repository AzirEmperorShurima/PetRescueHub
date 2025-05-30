// middleware/avatarUpload.js
import multer from 'multer';
import cloudinary from '../Config/Cloudinary.config.js';
import streamifier from 'streamifier';

const allowedFormats = process.env.CLOUDINARY_ALLOWED_FORMATS?.split(',') || ['jpg', 'png', 'jpeg'];
const maxFileSize = parseInt(process.env.CLOUDINARY_MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB

const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
};

const fileFilter = (req, file, cb) => {
    const extension = file.originalname.split('.').pop().toLowerCase();

    if (!allowedFormats.includes(extension)) {
        return cb(new Error(`Chỉ chấp nhận các file có định dạng: ${allowedFormats.join(', ')}`));
    }

    const expectedMimeType = mimeTypes[extension];
    if (file.mimetype !== expectedMimeType) {
        return cb(new Error('File không hợp lệ hoặc đã bị chỉnh sửa'));
    }

    if (parseInt(req.headers['content-length']) > maxFileSize) {
        return cb(new Error(`Kích thước file không được vượt quá ${maxFileSize / (1024 * 1024)}MB`));
    }

    cb(null, true);
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: maxFileSize,
        files: 1,
    },
    fileFilter,
}).single('avatar');

export const avatarUploadMiddleware = (folder = 'user_avatars') => {
    return (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }

            if (!req.file) {
                return next();
            }

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    allowed_formats: allowedFormats,
                    // transformation: [
                    //     {
                    //         width: parseInt(process.env.CLOUDINARY_IMAGE_WIDTH) || 200,
                    //         height: parseInt(process.env.CLOUDINARY_IMAGE_HEIGHT) || 200,
                    //         // crop: process.env.CLOUDINARY_CROP_MODE || 'fill',
                    //     },
                    // ],
                },
                (error, result) => {
                    if (error) {
                        return res.status(500).json({
                            success: false,
                            message: 'Lỗi khi upload lên Cloudinary',
                            error: error.message,
                        });
                    }

                    req.avatarUrl = result.secure_url;
                    req.cloudinaryPublicId = result.public_id;
                    next();
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
};
