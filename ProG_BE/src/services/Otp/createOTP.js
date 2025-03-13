const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}
export const otpGenerator = generateOTP(6);


// const crypto = require('crypto');

// function generateTOTP(secretKey, timeStep = 30, digits = 6) {
//     // Lấy thời gian hiện tại theo bước thời gian (tính bằng giây)
//     const time = Math.floor(Date.now() / 1000 / timeStep);

//     // Chuyển secretKey thành dạng buffer
//     const key = Buffer.from(secretKey, 'hex');

//     // Chuyển thời gian thành buffer 8-byte
//     const timeBuffer = Buffer.alloc(8);
//     for (let i = 7; i >= 0; i--) {
//         timeBuffer[i] = time & 0xff;
//         time = time >> 8;
//     }

//     // Tạo HMAC-SHA1
//     const hmac = crypto.createHmac('sha1', key).update(timeBuffer).digest();

//     // Trích xuất mã OTP từ HMAC
//     const offset = hmac[hmac.length - 1] & 0xf; // Lấy 4 bit cuối
//     const binary =
//         ((hmac[offset] & 0x7f) << 24) |
//         ((hmac[offset + 1] & 0xff) << 16) |
//         ((hmac[offset + 2] & 0xff) << 8) |
//         (hmac[offset + 3] & 0xff);

//     // Giới hạn OTP với số chữ số cần thiết
//     const otp = binary % 10 ** digits;
//     return otp.toString().padStart(digits, '0'); // Đảm bảo đủ chữ số bằng cách thêm '0' ở đầu
// }

// // Sử dụng:
// const secretKey = '1234567890abcdef1234567890abcdef'; // Một secret key ví dụ (hex)
// const otp = generateTOTP(secretKey);
// console.log('Your OTP is:', otp);
