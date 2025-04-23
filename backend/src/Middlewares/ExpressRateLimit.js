import rateLimit from "express-rate-limit";
import { redisClient } from "../Cache/User_Cache.js";
import RedisStore from "rate-limit-redis";
import { getUserIdFromCookies } from "../services/User/User.service.js";
// Rate limiter cho các API thông thường
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req) => {
        const userId = getUserIdFromCookies(req);
        return userId ? 1200 : 200;
    },
    keyGenerator: (req) => {
        return req.ip;
    },
    handler: (req, res, next) => {
        res.status(429).json({
            success: false,
            message: `Quá nhiều yêu cầu từ IP${req.ip} của bạn, vui lòng thử lại sau 15 phút.`
        });
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Rate limiter nghiêm ngặt hơn cho các endpoint nhạy cảm
export const strictLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Quá nhiều yêu cầu, vui lòng thử lại sau 5 phút."
    },
    standardHeaders: true,
    legacyHeaders: false
});

// export const loginLimiter = rateLimit({
//     store: new RedisStore({
//         client: redisClient,
//         prefix: "login-fail:"
//     }),
//     windowMs: 5 * 60 * 1000, // 5 phút
//     max: 5, // 5 lần login thất bại
//     keyGenerator: (req) => {
//         const accountId = req.body.username || req.body.email;
//         console.log(`Login attempt for account: ${accountId}`);
//         return accountId;
//     },
//     skipSuccessfulRequests: true, // Bỏ qua nếu login thành công
//     handler: (req, res, options) => {
//         const resetTime = new Date(Date.now() + options.windowMs).toISOString();
//         res.status(429).json({
//             success: false,
//             message: `Tài khoản của bạn đã bị tạm khóa đăng nhập do quá nhiều lần thử sai. Vui lòng thử lại sau: ${resetTime}`
//         });
//     },
//     standardHeaders: true,
//     legacyHeaders: false
// });