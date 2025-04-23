// import jwt from "jsonwebtoken";
// import { SECRET_KEY } from "../../../config.js";
// export const authenticateUser = (req, cookiePath) => {
//     const userCookies = req.cookies.cookiePath;
//     if (!userCookies) {
//         return new Error("No token provided");
//     }

//     try {
//         return jwt.verify(userCookies, SECRET_KEY);
//     } catch (err) {
//         throw new Error("Invalid or expired token");
//     }
// };
// /**
// * Lấy ID người dùng từ cookie
// * @param {Object} req - Đối tượng yêu cầu
// * @returns {String} - ID người dùng
// */
// export const getUserIdFromCookies = (data, req, cookiesPath) => {
//     if (!data) {
//         data = "id"
//     }
//     const decodedUser = authenticateUser(req, cookiesPath);
//     return decodedUser.data;
// }
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../../config.js";

/**
 * Xác thực token từ cookie
 * @param {Object} req - request object từ express
 * @param {string} cookiePath - tên cookie chứa token
 * @returns {Object} - Payload đã decode từ JWT
 */
export const authenticateUser = (req, cookiePath) => {
    const token = req.cookies[cookiePath];
    if (!token) {
        // throw new Error("No token provided");
        return null;
    }

    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};

/**
 * Lấy field cụ thể từ JWT token trong cookie
 * @param {Object} req - request object từ express
 * @param {string} cookiePath - tên cookie chứa token
 * @param {string} field - trường muốn lấy trong token (mặc định: 'id')
 * @returns {any} - giá trị trường tương ứng
 */
export const getUserFieldFromToken = (req, cookiePath, field = 'id') => {
    try {
        const decoded = authenticateUser(req, cookiePath);
        return decoded?.[field];
    } catch (err) {
        console.warn(`⚠️ getUserFieldFromToken error: ${err.message}`);
        return undefined;
    }
};
