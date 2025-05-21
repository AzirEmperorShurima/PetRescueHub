import { StatusCodes } from "http-status-codes";
import { COOKIE_PATHS, TOKEN_TYPE } from "../../config.js";
import Role from "../models/Role.js";
import User from "../models/user.js";
import { getUserFieldFromToken } from "../services/User/User.service.js";



/**
 * @detail function focus to premium users
 */
export const buyPremium = async (req, res) => {
    try {
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        const { paymentMethod, duration } = req.body;
        if (!paymentMethod || duration) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Thiếu thông tin thanh toán!" });
        }

        const validDurations = [7, 30, 90, 180, 365]; // Danh sách thời gian hợp lệ
        if (!validDurations.includes(duration)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Thời gian không hợp lệ!" });
        }

        const _user = await User.findById(userId);
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
        const paymentResult = await processPayment(User, paymentOptions);
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

export const updateUserProfile = async (req, res) => {
    try {
        const updateData = req.body;
        const allowedUpdates = new Set(["fullname", "avatar", "phonenumber", "address", "biography", "gender", "birthdate"]);
        const updates = Object.keys(updateData)
            .filter(key => allowedUpdates.has(key) && updateData[key] !== undefined);

        if (req.avatarUrl) {
            updateData.avatar = req.avatarUrl;
            updates.push("avatar");
        }

        if (updates.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: "Không có thông tin cần cập nhật!" 
            });
        }

        const updateFields = Object.fromEntries(
            updates.map(key => [key, updateData[key]])
        );

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        // Trả về thông tin đã được lọc
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Cập nhật thông tin thành công",
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                gender: updatedUser.gender,
                birthdate: updatedUser.birthdate,
                biography: updatedUser.biography,
                phonenumber: updatedUser.phonenumber,
                address: updatedUser.address,
                isVIP: updatedUser.isVIP,
                volunteerStatus: updatedUser.volunteerStatus
            }
        });
    } catch (error) {
        console.error("Lỗi cập nhật thông tin:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            message: "Đã xảy ra lỗi khi cập nhật thông tin" 
        });
    }
};
