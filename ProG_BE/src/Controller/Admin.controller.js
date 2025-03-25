import Role from "../models/Role";
import user from "../models/user";

/**
 * @desc Lấy danh sách người dùng (Chỉ Admin)
 */
export const getUsers = async (req, res) => {
    try {
        const users = await user.find().populate("roles", "name");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc Xóa người dùng (Chỉ Admin)
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await user.findByIdAndDelete(id);

        if (!deletedUser) return res.status(404).json({ message: "Người dùng không tồn tại!" });

        res.json({ message: "Xóa người dùng thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc Admin duyệt volunteer (Thêm role volunteer)
 */

export const acceptApproveVolunteer = async (req, res) => {
    try {
        const { userId } = req.params;

        // Tìm người dùng theo ID
        const user = await user.findById(userId).populate("roles");
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

        // Kiểm tra xem role "volunteer" đã tồn tại hay chưa
        // const volunteerRole = await Role.findOne({ name: "volunteer" });
        // if (!volunteerRole) return res.status(400).json({ message: "Role 'volunteer' chưa được tạo!" });

        // Kiểm tra nếu user đã có role "volunteer"
        const hasVolunteerRole = user.roles.some(role => role.name === "volunteer");
        if (hasVolunteerRole) {
            return res.status(400).json({ message: "Người dùng đã là volunteer!" });
        }
        /**
         * @desc nếu chưa populate
         */
        // if (user.roles.includes(volunteerRole._id)) {
        //     return res.status(400).json({ message: "User đã có role volunteer!" });
        // }

        // Thêm role "volunteer" cho user
        user.roles.push(volunteerRole._id);
        if (!user.isActive) {
            user.isActive = true; // Kích hoạt tài khoản sau khi duyệt
        }
        user.volunteerRequestStatus = "approved";
        await user.save();

        res.json({ message: "Người dùng đã được phê duyệt làm volunteer!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc Admin từ chối volunteer (Xóa role volunteer)
 */
export const rejectVolunteerRequest = async (req, res) => {
    try {
        const { userId } = req.body;

        const _user = await user.findById(userId);
        if (!_user) {
            return res.status(404).json({ message: "User không tồn tại!" });
        }

        if (_user.volunteerRequestStatus !== "pending") {
            return res.status(400).json({ message: "Người dùng chưa gửi yêu cầu hoặc yêu cầu đã được xử lý!" });
        }

        _user.volunteerRequestStatus = "rejected";
        await _user.save();

        return res.status(200).json({ message: "Yêu cầu volunteer đã bị từ chối!" });
    } catch (error) {
        console.error("Lỗi khi từ chối volunteer:", error);
        return res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

/**
 * @desc Admin Xóa role volunteer ()
 */
export const revokeVolunteerRole = async (req, res) => {
    try {
        const { userId } = req.body;

        const _user = await user.findById(userId);
        if (!_user) {
            return res.status(404).json({ message: "User không tồn tại!" });
        }

        // const volunteerRole = await Role.findOne({ name: "volunteer" });
        // if (!volunteerRole) {
        //     return res.status(400).json({ message: "Role 'volunteer' chưa được tạo!" });
        // }

        const hasVolunteerRole = user.roles.includes(volunteerRole._id);
        if (!hasVolunteerRole) {
            return res.status(400).json({ message: "Người dùng không có quyền volunteer!" });
        }

        _user.roles = _user.roles.filter(role => role.toString() !== volunteerRole._id.toString());
        await _user.save();

        return res.status(200).json({ message: "Quyền volunteer đã bị thu hồi!" });
    } catch (error) {
        console.error("Lỗi khi thu hồi quyền volunteer:", error);
        return res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};
