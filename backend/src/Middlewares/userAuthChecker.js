import { StatusCodes } from "http-status-codes";
import { COOKIE_PATHS, TOKEN_TYPE } from "../../config.js";
import { getUserFieldFromToken } from "../services/User/User.service.js";
import User from "../models/user.js";

export const checkUserAuth = async (req, res, next) => {
    try {

        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Bạn cần đăng nhập để thực hiện hành động này"
            });
        }
        const userEmail = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'email');
        if (!userEmail) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Bạn cần đăng nhập để thực hiện hành động này"
            });
        }

        const tokenType = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'tokenType');
        if (tokenType !== TOKEN_TYPE.ACCESS_TOKEN.name) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Token không hợp lệ"
            });
        }

        // Kiểm tra user tồn tại
        const user = await User.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Lỗi xác thực người dùng:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Lỗi xác thực người dùng"
        });
    }
};

// sub-middlware
export const checkUserRole = async (req, res, next) => {
    try {
        // checkUserAuth
        if (!req.user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Không tìm thấy thông tin người dùng"
            });
        }
        if (!req.user.roles.includes('user')) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Bạn không có quyền thực hiện hành động này"
            });
        }

        next();
    } catch (error) {
        console.error("Lỗi kiểm tra role người dùng:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Lỗi kiểm tra quyền người dùng"
        });
    }
};