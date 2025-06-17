import User from "../../models/user.js";
import Role from "../../models/Role.js";

export const resignVolunteerService = async (userId) => {
    try {
        const [user, volunteerRole] = await Promise.all([
            User.findById(userId).populate("roles"),
            Role.findOne({ name: "volunteer" }).select("_id")
        ]);

        if (!user) {
            return { success: false, message: "Người dùng không tồn tại!" };
        }

        if (!volunteerRole) {
            return { success: false, message: "Role 'volunteer' không tồn tại trong hệ thống!" };
        }

        const hasVolunteerRole = user.roles.some(role => role._id.equals(volunteerRole._id));
        if (!hasVolunteerRole) {
            return { success: false, message: "Bạn không có quyền volunteer!" };
        }

        // Xóa role volunteer
        user.roles = user.roles.filter(role => !role._id.equals(volunteerRole._id));
        user.volunteerRequestStatus = "none";
        user.volunteerStatus = "none";

        await user.save();

        return {
            success: true,
            message: "Đã từ bỏ quyền volunteer thành công!",
            data: user
        };
    } catch (error) {
        console.error("Lỗi trong resignVolunteerService:", error);
        return { success: false, message: "Lỗi server", error: error.message };
    }
};