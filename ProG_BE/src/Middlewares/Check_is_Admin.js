
import user from "../models/user.js";
import { getUserFieldFromToken } from "../services/User/User.service.js";
import { COOKIE_PATHS, TOKEN_TYPE } from "../../config.js";
import { redisClient } from "../Cache/User_Cache.js";

export const clearAdminCache = async (userId) => {
    try {
        const redisKey = `admin:${userId}`;
        await redisClient.del(redisKey);
        console.log(`🧹 Cache Redis quyền admin đã được xóa cho user ${userId}`);
    } catch (error) {
        console.error("❌ Lỗi khi xóa cache Redis:", error);
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "id");
        const userEmail = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "email");
        const userRoles = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'roles');
        const tokenType = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "tokenType");

        if (!userId || !userEmail || !userRoles || tokenType !== TOKEN_TYPE.ACCESS_TOKEN.name) {
            return res.status(403).json({ message: "Unauthorized: Token không hợp lệ hoặc bị giả mạo!" });
        }
        const primaryCheckIsAdmin = userRoles.includes('admin') || userRoles.includes('super_admin');
        if (!primaryCheckIsAdmin) {
            return res.status(403).json({ message: "Access Denied: User is not permission to use this resource" });
        }
        const redisKey = `admin:permission:${userId}`;
        const cached = await redisClient.get(redisKey);
        if (cached === "true") {
            console.log("✅ Đã xác thực quyền admin từ Redis cache!");
            return next();
        }

        const foundUser = await user.findById(userId).populate("roles", "name");
        if (!foundUser || foundUser.email !== userEmail) {
            return res.status(403).json({ message: "Access Denied: Tài khoản không hợp lệ!" });
        }

        const isAdmin = foundUser.roles.some(r => r.name === "admin" || r.name === "super_admin");
        if (!isAdmin) {
            return res.status(403).json({ message: "Access Denied: Không có quyền admin!" });
        }

        // Ghi cache Redis trong 10 phút
        await redisClient.setEx(redisKey, 900, "true");
        console.log("✅ Xác thực quyền admin từ DB và ghi vào Redis!");
        next();

    } catch (error) {
        console.error("❌ Lỗi trong middleware isAdmin:", error);
        return res.status(500).json({ message: "Lỗi máy chủ khi xác thực quyền admin!" });
    }
};
