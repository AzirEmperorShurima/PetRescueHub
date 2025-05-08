import multer from 'multer';


const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB mỗi file
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
        }
    }
});

/**
 * Middleware upload nhiều ảnh, không giới hạn số lượng
 * @param {string} fieldName - Tên trường chứa danh sách ảnh (vd: 'images')
 */
export const uploadImages = (fieldName = 'images') => {
    return [
        upload.array(fieldName), // Không truyền maxCount => không giới hạn số ảnh
        async (req, res, next) => {
            try {
                if (!req.files || req.files.length === 0) {
                    return next();
                }

                const uploadedImageUrls = [];

                for (const file of req.files) {
                    console.log(`Đang upload: ${file.originalname}`);
                    const uploadResult = await uploadToGoogleDrive(file);
                    if (!uploadResult.success) {
                        return res.status(500).json({
                            success: false,
                            message: uploadResult.message || 'Lỗi khi upload ảnh'
                        });
                    }
                    uploadedImageUrls.push(uploadResult.fileUrl);
                    console.log(`Đã upload: ${uploadResult.fileUrl}`);
                }

                req.uploadedImageUrls = uploadedImageUrls;
                next();
            } catch (error) {
                console.error('Lỗi khi upload ảnh:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi server khi upload ảnh',
                    error: error.message,
                });
            }
        }
    ];
};
