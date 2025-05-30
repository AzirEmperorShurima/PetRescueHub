import { StatusCodes } from "http-status-codes";
import user from "../../models/user.js";
import { COOKIE_PATHS, TOKEN_TYPE } from "../../../config.js";
import { getUserFieldFromToken } from "../../services/User/User.service.js";
import { redisClient } from "../../Config/redis.client.js";

export const verifyAccessTokenMiddleware = (req, res, next) => {
    try {
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "id");
        const userEmail = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "email");
        const userRoles = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "roles");
        const tokenType = getUserFieldFromToken(req, TOKEN_TYPE.ACCESS_TOKEN.name, "tokenType");

        if (!userId || !userEmail || !userRoles || tokenType !== TOKEN_TYPE.ACCESS_TOKEN.name) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Unauthorized: Access Token không hợp lệ hoặc đã bị giả mạo!"
            });
        }

        req.user = { _id: userId, email: userEmail, roles: userRoles, tokenType: tokenType };

        next();
    } catch (error) {
        console.error("Lỗi khi xác thực access token:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi hệ thống!" });
    }
};

export const verifyRefreshTokenMiddleware = (req, res, next) => {
    try {
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.REFRESH_TOKEN.CookieName, "id");
        const tokenType = getUserFieldFromToken(req, COOKIE_PATHS.REFRESH_TOKEN.CookieName, "tokenType");

        if (!userId || tokenType !== TOKEN_TYPE.REFRESH_TOKEN.name) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Unauthorized: Refresh Token không hợp lệ!"
            });
        }

        req.refreshUser = { _id: userId, tokenType: tokenType };

        next();
    } catch (error) {
        console.error("Lỗi khi xác thực refresh token:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi hệ thống!" });
    }
};

export const validateTokenFields = (req) => {
    const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "id");
    const userEmail = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "email");
    const userRoles = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'roles');
    const tokenType = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "tokenType");

    if (!userId || !userEmail || !userRoles || tokenType !== TOKEN_TYPE.ACCESS_TOKEN.name) {
        return {
            isValid: false,
            status: StatusCodes.UNAUTHORIZED,
            message: "Unauthorized: Token không hợp lệ hoặc bị giả mạo!"
        };
    }
    return {
        isValid: true,
        userId,
        userEmail,
        userRoles,
        tokenType
    };
};

export const RoleChecking = (roleName, options = {}) => {
    const {
        redisKeyPrefix = roleName.toLowerCase(),
        cacheTTL = 900,
        customMessages = {}
    } = options;

    return async (req, res, next) => {
        try {
            const tokenValidation = validateTokenFields(req);

            if (!tokenValidation.isValid) {
                return res.status(tokenValidation.status).json({
                    success: false,
                    message: tokenValidation.message
                });
            }

            const { userId, userEmail, userRoles, tokenType } = tokenValidation;

            if (!userRoles.includes(roleName)) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    message: customMessages.noRole || `Access Denied: Bạn không có quyền ${roleName}`
                });
            }

            const redisKey = `${redisKeyPrefix}:permission:${userId}`;
            const cached = await redisClient.get(redisKey);

            if (cached === "true") {
                console.log(`✅ Đã xác thực quyền ${roleName} từ Redis cache!`);
                req.user = { _id: userId, email: userEmail, roles: userRoles };
                return next();
            }

            const foundUser = await user.findById(userId)
                .select('email roles')
                .populate("roles", "name")
                .lean();

            if (!foundUser || foundUser.email !== userEmail) {
                return res.status(foundUser ? StatusCodes.FORBIDDEN : StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: foundUser
                        ? (customMessages.invalidUser || "Access Denied: Thông tin người dùng không khớp!")
                        : (customMessages.userNotFound || "Không tìm thấy thông tin người dùng")
                });
            }

            const hasRole = foundUser.roles.some(r => r.name === roleName);
            if (!hasRole) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    message: customMessages.noPermission || `Access Denied: Bạn không có quyền ${roleName}!`
                });
            }

            await redisClient.setEx(redisKey, cacheTTL, "true");
            console.log(`✅ Xác thực quyền ${roleName} từ DB và ghi vào Redis!`);

            req.user = { _id: userId, email: userEmail, roles: userRoles };
            req.token_verified = { tokenType: tokenType };
            next();
        } catch (error) {
            console.error(`❌ Lỗi trong middleware ${roleName}Check:`, error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: customMessages.serverError || `Lỗi máy chủ khi xác thực quyền ${roleName}!`
            });
        }
    };
};