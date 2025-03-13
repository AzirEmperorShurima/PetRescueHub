import CryptoJS from "crypto-js";
import crypto from "crypto";

export const MASTER_PRIVARE_KEY = process.env.MASTER_PRIVARE_KEY

export const hashValue = (value) => {
    return CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
};

export const encrypt1 = async (message, key) => {
    const cipherText = CryptoJS.AES.encrypt(message, key).toString();
    console.log(cipherText)
    return cipherText;
}

export const decrypt1 = async (cipherText, key) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

export const encrypt = async (message, key) => {
    const iv = CryptoJS.enc.Utf8.parse('0000000000000000'); // IV cố định, 16 byte
    const cipherText = CryptoJS.AES.encrypt(message, MASTER_PRIVARE_KEY, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString();
    console.log(cipherText);
    return cipherText;
}

export const decrypt = async (cipherText, key) => {
    const iv = CryptoJS.enc.Utf8.parse('0000000000000000'); // IV cố định
    const bytes = CryptoJS.AES.decrypt(cipherText, MASTER_PRIVARE_KEY, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

export const createHash256 = (input, PRIVATE_KEY) => {
    const dataWithKey = `${PRIVATE_KEY}:${input}`;
    return crypto.createHash('sha256').update(dataWithKey).digest('hex');
};
export const compareCryptoJS = (planText, encryptedText) => {
    try {
        if (encryptedText === encrypt(planText), MASTER_PRIVARE_KEY) {
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error.message)
    }
}


export const encryptWithIV = (message, key) => {
    const iv = CryptoJS.lib.WordArray.random(16); // Tạo IV ngẫu nhiên
    const encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv }).toString();
    return `${iv.toString(CryptoJS.enc.Hex)}:${encrypted}`; // Lưu IV kèm dữ liệu mã hóa
};

// Giải mã với IV
export const decryptWithIV = (cipherText, key) => {
    const [ivHex, encrypted] = cipherText.split(':');
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const bytes = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });
    return bytes.toString(CryptoJS.enc.Utf8);
};