import crypto from 'crypto';

const ENCRYPTION_KEY = crypto.randomBytes(32); // 32 bytes key
const IV_LENGTH = 16; // 16 bytes initialization vector

// Hàm mã hóa
export const _encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`; // Ghép IV và dữ liệu đã mã hóa
};

// Hàm giải mã
export const _decrypt = (encrypted) => {
  const [iv, encryptedText] = encrypted.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
