import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { sendCommand } from "../Config/redis.client.js";
import { getUserFieldFromToken } from "../services/User/User.service.js";
import { COOKIE_PATHS } from "../../config.js";

// Cấu hình chung cho rate limit
const RATE_LIMIT_CONFIG = {
    api: {
        windowMs: 15 * 60 * 1000,
        limits: {
            authenticated: 1200,
            guest: 200,
        },
    },
    strict: {
        windowMs: 5 * 60 * 1000,
        limit: 10,
    },
    login: {
        windowMs: 5 * 60 * 1000,
        limit: 5,
        prefix: "login-fail:",
    },
};

const customKeyGenerator = (req, type) => {
    if (type === "login") {
        const accountId = req.body.username || req.body.email || req.ip;
        return `login:${accountId}`;
    }
    const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "id");
    return userId ? `user:${userId}` : `ip:${req.ip}`;
};

const logRateLimit = (req, userId, limit, type) => {
    let logMessage = "";
    if (type === "login") {
        const accountId = req.body.username || req.body.email || "unknown";
        logMessage = `Thử đăng nhập cho tài khoản ${accountId} - Giới hạn ${limit} lần trong ${RATE_LIMIT_CONFIG.login.windowMs / 60000
            } phút`;
    } else {
        logMessage = userId
            ? `User inside request: ${userId} - Giới hạn ${limit} yêu cầu trong ${RATE_LIMIT_CONFIG[type].windowMs / 60000
            } phút`
            : `Guest from IP ${req.ip} - Giới hạn ${limit} yêu cầu trong ${RATE_LIMIT_CONFIG[type].windowMs / 60000
            } phút`;
    }
    console.log(logMessage);
};


export const apiLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: sendCommand,
        prefix: "rate:api:",
    }),
    windowMs: RATE_LIMIT_CONFIG.api.windowMs,
    max: (req) => {
        try {
            const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "id");
            const limit = userId ? RATE_LIMIT_CONFIG.api.limits.authenticated : RATE_LIMIT_CONFIG.api.limits.guest;
            logRateLimit(req, userId, limit, "api");
            return limit;
        } catch (error) {
            console.error("Lỗi xác định giới hạn API:", error);
            return RATE_LIMIT_CONFIG.api.limits.guest;
        }
    },
    keyGenerator: (req) => customKeyGenerator(req, "api"),
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: `Vượt quá giới hạn yêu cầu từ ${customKeyGenerator(req, "api")}. Vui lòng thử lại sau ${RATE_LIMIT_CONFIG.api.windowMs / 60000
                } phút.`,
            retryAfter: RATE_LIMIT_CONFIG.api.windowMs / 1000,
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        const whitelist = process.env.IP_WHITELIST?.split(",") || [];
        return whitelist.includes(req.ip) || req.path.startsWith("/admin");
    },
});

export const strictLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: sendCommand,
        prefix: "rate:strict:",
    }),
    windowMs: RATE_LIMIT_CONFIG.strict.windowMs,
    max: RATE_LIMIT_CONFIG.strict.limit,
    keyGenerator: (req) => customKeyGenerator(req, "strict"),
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: `Vượt quá giới hạn yêu cầu cho endpoint nhạy cảm. Vui lòng thử lại sau ${RATE_LIMIT_CONFIG.strict.windowMs / 60000
                } phút.`,
            retryAfter: RATE_LIMIT_CONFIG.strict.windowMs / 1000,
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const loginLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: sendCommand,
        prefix: RATE_LIMIT_CONFIG.login.prefix,
    }),
    windowMs: RATE_LIMIT_CONFIG.login.windowMs,
    max: RATE_LIMIT_CONFIG.login.limit,
    keyGenerator: (req) => customKeyGenerator(req, "login"),
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        const resetTime = new Date(Date.now() + RATE_LIMIT_CONFIG.login.windowMs).toISOString();
        res.status(429).json({
            success: false,
            message: `Tài khoản của bạn đã bị tạm khóa đăng nhập do quá nhiều lần thử sai. Vui lòng thử lại sau: ${resetTime}`,
            retryAfter: RATE_LIMIT_CONFIG.login.windowMs / 1000,
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});