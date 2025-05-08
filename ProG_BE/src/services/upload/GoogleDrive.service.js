import { google } from 'googleapis';
import stream from 'stream';
import { parentFolder } from '../../../config.js';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS),
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });


/**
 * Tạo thư mục mới trên Google Drive
 */
const createFolder = async (folderName, parentId = null) => {
    const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : [],
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        fields: 'id',
    });

    return response.data.id;
};

/**
 * Tìm thư mục theo tên trong thư mục cha
 */
const findFolder = async (name, parentId = null) => {
    const query = `'${parentId || 'root'}' in parents and mimeType='application/vnd.google-apps.folder' and name='${name}' and trashed=false`;
    const res = await drive.files.list({
        q: query,
        fields: 'files(id, name)',
    });
    return res.data.files[0] || null;
};


/**
 * Tạo hoặc lấy các thư mục lồng nhau theo user
 */
export const getOrCreateNestedFolders = async (userId) => {
    // 1.Parent Folder 
    let rootFolder = await findFolder(parentFolder);
    if (!rootFolder) rootFolder = { id: await createFolder(parentFolder) };

    // 2. Folder {Parent}/userId/
    let userFolder = await findFolder(userId, rootFolder.id);
    if (!userFolder) userFolder = { id: await createFolder(userId, rootFolder.id) };

    // 3. Subfolders 
    const subfolderNames = ['album', 'postImage', 'petAlbum'];
    const subfolderIds = {};
    for (const name of subfolderNames) {
        let folder = await findFolder(name, userFolder.id);
        if (!folder) folder = { id: await createFolder(name, userFolder.id) };
        subfolderIds[name] = folder.id;
    }

    return {
        rootId: rootFolder.id,
        userId: userFolder.id,
        ...subfolderIds
    };
};

/**
 * Upload file vào thư mục chỉ định
 */
export const uploadToFolder = async (file, folderId) => {
    try {
        if (!file) return { success: false, message: 'Không có file để upload' };

        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);

        const fileMetadata = {
            name: `${Date.now()}_${file.originalname}`,
            parents: [folderId],
        };

        const media = {
            mimeType: file.mimetype,
            body: bufferStream,
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media,
            fields: 'id,webViewLink,webContentLink',
        });

        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        return {
            success: true,
            fileUrl: response.data.webContentLink,
            fileId: response.data.id,
        };
    } catch (error) {
        console.error('❌ Lỗi khi upload lên Google Drive:', error);
        return {
            success: false,
            message: 'Lỗi khi upload file lên Google Drive',
            error: error.message,
        };
    }
};

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

        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);

        const fileMetadata = {
            name: `${Date.now()}_${file.originalname}`,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
        };

        const media = {
            mimeType: file.mimetype,
            body: bufferStream,
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id,webViewLink,webContentLink',
        });

        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

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