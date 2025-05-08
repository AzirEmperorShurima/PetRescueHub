import { google } from 'googleapis';
import stream from 'stream';

// Cấu hình Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Upload file lên Google Drive
 * @param {Object} file - File từ multer
 * @returns {Promise<Object>} - Kết quả upload
 */
export const uploadToGoogleDrive = async (file) => {
    try {
        if (!file) {
            return { success: false, message: 'Không có file để upload' };
        }

        // Tạo readable stream từ buffer
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);

        // Cấu hình metadata cho file
        const fileMetadata = {
            name: `${Date.now()}_${file.originalname}`,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // ID thư mục trên Google Drive
        };

        // Cấu hình media
        const media = {
            mimeType: file.mimetype,
            body: bufferStream,
        };

        // Upload file lên Google Drive
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id,webViewLink,webContentLink',
        });

        // Cấu hình quyền truy cập công khai cho file
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Lấy URL truy cập file
        const fileUrl = response.data.webContentLink;

        return {
            success: true,
            fileUrl,
            fileId: response.data.id,
        };
    } catch (error) {
        console.error('Lỗi khi upload lên Google Drive:', error);
        return {
            success: false,
            message: 'Lỗi khi upload file lên Google Drive',
            error: error.message,
        };
    }
};