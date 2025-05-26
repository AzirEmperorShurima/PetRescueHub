import Busboy from 'busboy';

/**
 * Middleware đọc postType trước khi file được xử lý
 * và thêm vào req.body để các middleware sau dùng
 */
export const detectPostType = (req, res, next) => {
    if (req.method !== 'POST' || !req.headers['content-type']?.includes('multipart/form-data')) {
        return next();
    }

    // Lưu trữ dữ liệu gốc của request
    const chunks = [];
    req.on('data', chunk => {
        chunks.push(chunk);
    });

    const busboy = Busboy({ headers: req.headers });
    
    busboy.on('field', (fieldname, val) => {
        if (fieldname === 'postType') {
            req.body = req.body || {};
            req.body.postType = val;
            
            // Ngắt kết nối busboy sau khi đã đọc postType
            busboy.removeAllListeners('field');
            busboy.removeAllListeners('file');
            busboy.removeAllListeners('finish');
            
            // Khôi phục dữ liệu request gốc
            const buffer = Buffer.concat(chunks);
            req.headers['content-length'] = buffer.length;
            
            // Tạo stream mới từ buffer đã lưu
            const newStream = require('stream');
            const readable = new newStream.Readable();
            readable._read = () => {}; // _read là bắt buộc nhưng không cần thực hiện gì
            readable.push(buffer);
            readable.push(null);
            
            // Thay thế req bằng stream mới
            readable.headers = req.headers;
            Object.assign(readable, {
                headers: req.headers,
                body: req.body
            });
            
            // Gán các thuộc tính và phương thức cần thiết từ req gốc
            req.removeAllListeners('data');
            req.removeAllListeners('end');
            
            // Chuyển tiếp đến middleware tiếp theo
            next();
            return;
        }
    });

    busboy.on('finish', () => {
        next();
    });

    req.pipe(busboy);
};
