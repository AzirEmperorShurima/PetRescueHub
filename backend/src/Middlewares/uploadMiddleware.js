import multer from 'multer';
import { uploadToGoogleDrive } from '../services/Upload/GoogleDrive.service.js';

// Cấu hình multer để xử lý file upload
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
    },
    fileFilter: (req, file, cb) => {
        // Kiểm tra loại file
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
        }
    }
});

// Middleware xử lý upload ảnh và lưu vào Google Drive
export const uploadImage = (fieldName) => {
    return [
        // Sử dụng multer để xử lý file upload
        upload.single(fieldName),
        
        // Middleware xử lý upload lên Google Drive
        async (req, res, next) => {
            try {
                // Nếu không có file, bỏ qua
                if (!req.file) {
                    return next();
                }
                
                console.log(`Đang xử lý upload file: ${req.file.originalname}`);
                
                // Upload file lên Google Drive
                const uploadResult = await uploadToGoogleDrive(req.file);
                
                if (!uploadResult.success) {
                    return res.status(500).json({
                        success: false,
                        message: uploadResult.message || 'Lỗi khi upload ảnh'
                    });
                }
                
                // Lưu URL của file đã upload vào request để sử dụng ở controller
                req.fileUrl = uploadResult.fileUrl;
                console.log(`File đã được upload: ${req.fileUrl}`);
                
                next();
            } catch (error) {
                console.error('Lỗi xử lý upload:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi server khi xử lý upload ảnh'
                });
            }
        }
    ];
};