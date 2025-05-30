import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";

/**
 * Middleware kiểm tra mật khẩu cấp 2 của người dùng
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const checkSecondaryPassword = async (req, res, next) => {
    // Kiểm tra xem có mật khẩu cấp 2 trong request body không
    const { secondaryPassword } = req.body;
    if (!secondaryPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Mật khẩu cấp 2 là bắt buộc cho hành động này"
        });
    }

    try {
        // Lấy userId từ user đã xác thực
        const userId = req.user?._id;
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Người dùng chưa được xác thực"
            });
        }

        // Truy vấn database chỉ lấy trường secondaryPassword
        const user = await mongoose.model("User")
            .findById(userId)
            .select("secondaryPassword")
            .lean()
            .exec(); // Thêm exec() để đảm bảo promise được trả về

        // Kiểm tra user tồn tại
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Không tìm thấy người dùng"
            });
        }

        // Kiểm tra user đã thiết lập mật khẩu cấp 2 chưa
        if (!user.secondaryPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Tài khoản này chưa thiết lập mật khẩu cấp 2"
            });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(secondaryPassword, user.secondaryPassword);
        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Mật khẩu cấp 2 không đúng"
            });
        }

        // Mật khẩu đúng, tiếp tục middleware tiếp theo
        next();
    } catch (error) {
        console.error("Lỗi trong middleware checkSecondaryPassword:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Lỗi máy chủ khi kiểm tra mật khẩu cấp 2",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};