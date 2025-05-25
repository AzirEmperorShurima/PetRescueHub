import { StatusCodes } from "http-status-codes";
import user from "../models/user.js";
import { validateTokenFields, RoleChecking } from "../utils/auth/authUtils.js";

export const checkUserAuth = async (req, res, next) => {
    try {
        const tokenValidation = validateTokenFields(req);

        if (!tokenValidation.isValid) {
            return res.status(tokenValidation.status).json({
                success: false,
                message: tokenValidation.message
            });
        }

        const { userId, userEmail,tokenType } = tokenValidation;

        const foundUser = await user.findById(userId);
        if (!foundUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }

        if (foundUser.email !== userEmail) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Thông tin người dùng không khớp"
            });
        }

        req.user = foundUser;
        req.token_verified = { tokenType: tokenType };
        next();
    } catch (error) {
        console.error("Lỗi xác thực người dùng:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Lỗi xác thực người dùng"
        });
    }
};

export const checkUserRole = RoleChecking('user', {
    redisKeyPrefix: 'user',
    customMessages: {
        noRole: 'Bạn không có quyền user để truy cập',
        invalidUser: 'Thông tin người dùng không khớp',
        userNotFound: 'Không tìm thấy thông tin người dùng',
        serverError: 'Lỗi hệ thống khi kiểm tra quyền user'
    }
});