import user from "../models/user.js";
import { redisClient } from "../Config/redis.client.js";
import { StatusCodes } from "http-status-codes";
import { RoleChecking } from "../utils/auth/authUtils.js";

export const clearAdminCache = async (userId) => {
    try {
        const redisKey = `admin:permission:${userId}`;
        await redisClient.del(redisKey);
        console.log(`🧹 Cache Redis quyền admin đã được xóa cho user ${userId}`);
    } catch (error) {
        console.error("❌ Lỗi khi xóa cache Redis:", error);
    }
};

export const isAdmin = RoleChecking('admin', {
    redisKeyPrefix: 'admin',
    customMessages: {
        noRole: 'Bạn không có quyền admin để truy cập',
        serverError: 'Lỗi hệ thống khi kiểm tra quyền admin'
    }
});

export const checkAdminLogin = async (req, res, next) => {
    try {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: !emailOrUsername ? "Email hoặc username là bắt buộc" : "Mật khẩu là bắt buộc"
            });
        }

        const foundUser = await user.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        })
            .select('password roles isActive')
            .populate("roles", "name")
            .lean();

        if (!foundUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Không tìm thấy người dùng"
            });
        }

        if (!foundUser.isActive) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Tài khoản chưa được kích hoạt hoặc đã bị khóa!"
            });
        }

        const isPasswordValid = await user.comparePassword(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Mật khẩu không chính xác!"
            });
        }

        const hasAdminRole = foundUser.roles.some(role =>
            role.name === 'admin' || role.name === 'super_admin'
        );

        if (!hasAdminRole) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Bạn không phải admin nên không có quyền đăng nhập vào hệ thống quản trị!"
            });
        }

        req.user = foundUser;
        next();
    } catch (error) {
        console.error("❌ Lỗi trong middleware checkAdminLogin:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Lỗi máy chủ khi xác thực vai trò admin!"
        });
    }
};
