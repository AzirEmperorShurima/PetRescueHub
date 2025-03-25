import Role from "../models/Role";
import user from "../models/user";
import { authenticateUser } from "./Forum.Controller";

/**
 * @detail function focus to premium users
 */
export const buyPremium = async (req, res) => {
    try {
        const userId = authenticateUser(req)
        const { paymentMethod, duration } = req.body;
        if (!userId || !paymentMethod || duration) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Thiếu thông tin thanh toán!" });
        }

        const validDurations = [7, 30, 90, 180, 365]; // Danh sách thời gian hợp lệ
        if (!validDurations.includes(duration)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Thời gian không hợp lệ!" });
        }

        const _user = await user.findById(userId);
        if (!_user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Người dùng không tồn tại!" });
        }

        // Kiểm tra nếu user đã là VIP
        if (_user.isVIP) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Người dùng đã là VIP!" });
        }
        const paymentOptions = {
            duration: duration,
            paymentMethod: paymentMethod
        }
        // Gọi API cổng thanh toán (ví dụ: Stripe, PayPal, VNPay, MoMo)
        const paymentResult = await processPayment(user, paymentOptions);
        if (!paymentResult.success) {
            return res.status(StatusCodes.PAYMENT_REQUIRED).json({ message: "Thanh toán thất bại!", error: paymentResult.error });
        }

        // Cập nhật thông tin VIP
        // const vipRole = await Role.findOne({ name: "VIP" });
        // if (!vipRole) {
        //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Role 'VIP' chưa được tạo!" });
        // }

        _user.isVIP = true;
        _user.premiumExpiresAt = new Date(Date.now() + (duration * 24 * 60 * 60 * 1000)); // VIP 30 ngày
        _user.roles.push(vipRole._id);
        await _user.save();

        return res.status(StatusCodes.OK).json({
            message: "Mua VIP thành công! Chúc mừng bạn đã trở thành thành viên VIP 🎉",
            isVIP: _user.isVIP,
            premiumExpiresAt: _user.premiumExpiresAt
        });

    } catch (error) {
        console.error("Lỗi khi mua Premium:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Lỗi khi xử lý thanh toán!",
            error: error.message || "Lỗi không xác định"
        });
    }
};
