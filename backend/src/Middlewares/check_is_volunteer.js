
import user from "../models/user.js";
import { getUserFieldFromToken } from "../services/User/User.service.js";
import { COOKIE_PATHS, TOKEN_TYPE } from "../../config.js";
import { redisClient } from "../Cache/User_Cache.js";
import { StatusCodes } from "http-status-codes";

export const clearvolunteerCache = async (userId) => {
    try {
        const redisKey = `volunteer:${userId}`;
        await redisClient.del(redisKey);
        console.log(`🧹 Cache Redis quyền volunteer đã được xóa cho user ${userId}`);
    } catch (error) {
        console.error("❌ Lỗi khi xóa cache Redis:", error);
    }
};

export const isVolunteer = async (req, res, next) => {
    try {
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "id");
        const userEmail = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "email");
        const userRoles = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'roles');
        const tokenType = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "tokenType");

        if (!userId || !userEmail || !userRoles || tokenType !== TOKEN_TYPE.ACCESS_TOKEN.name) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ 
                message: "Unauthorized: Token không hợp lệ hoặc bị giả mạo!" 
            });
        }

        const primaryCheckIsVolunteer = userRoles.includes('volunteer');
        if (!primaryCheckIsVolunteer) {
            return res.status(StatusCodes.FORBIDDEN).json({ 
                message: "Access Denied: Bạn không có quyền truy cập tài nguyên này" 
            });
        }

        const redisKey = `volunteer:permission:${userId}`;
        const cached = await redisClient.get(redisKey);
        
        if (cached === "true") {
            console.log("✅ Đã xác thực quyền volunteer từ Redis cache!");
            req.user = {
                _id: userId,
                email: userEmail,
                roles: userRoles,
            };
            return next();
        }

        const foundUser = await user.findById(userId).populate("roles", "name");
        if (!foundUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                message: "Không tìm thấy thông tin người dùng" 
            });
        }

        if (foundUser.email !== userEmail) {
            return res.status(StatusCodes.FORBIDDEN).json({ 
                message: "Access Denied: Thông tin người dùng không khớp!" 
            });
        }

        const isVolunteer = foundUser.roles.some(r => r.name === "volunteer");
        if (!isVolunteer) {
            return res.status(StatusCodes.FORBIDDEN).json({ 
                message: "Access Denied: Bạn không có quyền volunteer!" 
            });
        }

        await redisClient.setEx(redisKey, 900, "true");
        console.log("✅ Xác thực quyền volunteer từ DB và ghi vào Redis!");
        
        req.user = {
            _id: userId,
            email: userEmail,
            roles: userRoles,
        };
        
        next();
    } catch (error) {
        console.error("❌ Lỗi trong middleware isVolunteer:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: "Lỗi máy chủ khi xác thực quyền volunteer!" 
        });
    }
};

export const checkVolunteer = async (req, res, next) => {
    try {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                message: "Email hoặc username là bắt buộc" 
            });
        }
        
        if (!password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                message: "Mật khẩu là bắt buộc" 
            });
        }

        const foundUser = await user.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        }).populate("roles", "name");

        if (!foundUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                message: "Không tìm thấy người dùng" 
            });
        }

        const hasVolunteerRole = foundUser.roles.some(role => role.name === 'volunteer');
        if (!hasVolunteerRole) {
            return res.status(StatusCodes.FORBIDDEN).json({ 
                message: "Bạn không phải volunteer nên không có quyền truy cập vào tài nguyên này!" 
            });
        }

        req.user = foundUser;
        next();
    } catch (error) {
        console.error("❌ Lỗi trong middleware checkVolunteer:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: "Lỗi máy chủ khi xác thực vai trò volunteer!" 
        });
    }
};
