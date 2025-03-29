import User from "../models/user.js";
import { getUserIdFromCookies } from "../services/User/User.service.js";

export const requestVolunteer = async (req, res) => {
    try {
        const userId = getUserIdFromCookies(req); // Lấy ID từ token đăng nhập
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User không tồn tại!" });

        if (user.volunteerRequestStatus === "pending") {
            return res.status(400).json({ message: "Bạn đã gửi yêu cầu trước đó, vui lòng chờ duyệt!" });
        }

        if (user.volunteerRequestStatus === "approved") {
            return res.status(400).json({ message: "Bạn đã được phê duyệt làm volunteer!" });
        }

        // Cập nhật trạng thái
        user.volunteerRequestStatus = "pending";
        await user.save();

        return res.status(200).json({ message: "Yêu cầu volunteer đã được gửi, vui lòng chờ duyệt!" });
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu volunteer:", error);
        return res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};
