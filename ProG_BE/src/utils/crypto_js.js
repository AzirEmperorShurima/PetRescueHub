
import crypto from "crypto";

export const MASTER_PRIVATE_KEY = process.env.MASTER_PRIVATE_KEY;

export const generateSocketKey = (userId) => {

    const salt = crypto.randomBytes(32).toString('hex');
    const dataToHash = `${MASTER_PRIVATE_KEY}:${userId}:${salt}:${Date.now()}`;
    const hash = crypto.createHash('sha512').update(dataToHash).digest('hex');
    return {
        key: hash,
        salt: salt
    };
};


export const verifySocketKey = (userId, providedKey, salt) => {
    try {
        const dataToHash = `${MASTER_PRIVATE_KEY}:${userId}:${salt}:${Date.now()}`;
        const hash = crypto.createHash('sha512').update(dataToHash).digest('hex');
        
        return crypto.timingSafeEqual(
            Buffer.from(hash, 'hex'),
            Buffer.from(providedKey, 'hex')
        );
    } catch (error) {
        console.error('Socket key verification failed:', error);
        return false;
    }
};

// Mã hóa dữ liệu socket với AES-256-GCM
export const encryptSocketData = (data, key) => {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex').slice(0, 32), iv);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return {
            encrypted: encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    } catch (error) {
        throw new Error('Encryption failed: ' + error.message);
    }
};

// Giải mã dữ liệu socket
export const decryptSocketData = (encryptedData, key, iv, authTag) => {
    try {

        const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            Buffer.from(key, 'hex').slice(0, 32),
            Buffer.from(iv, 'hex')
        );
        
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    } catch (error) {
        throw new Error('Decryption failed: ' + error.message);
    }
};