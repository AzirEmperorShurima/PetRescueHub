import Role from "../models/Role.js";
import user from "../models/user.js";
import { createPackage } from "../services/PackageService/PackageService.js";
import { authenticateUser } from "./Forum.Controller.js";

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
        const decodedUser = authenticateUser(req)
        const userId = decodedUser.id;
        // Tìm người dùng theo ID
        const _user = await user.findById(userId).populate("roles");
        if (!_user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

        const volunteerRole = await Role.findOne({ name: "volunteer" }).select("_id");
        if (!volunteerRole) return res.status(400).json({ message: "Role 'volunteer' chưa được tạo!" });

        // Kiểm tra nếu user đã có role "volunteer"
        // const hasVolunteerRole = _user.roles.some(role => role.name === "volunteer");
        // if (hasVolunteerRole) {
        //     return res.status(400).json({ message: "Người dùng đã là volunteer!" });
        // }
        _user.roles = [...new Set([...user.roles, volunteerRole._id])];
        /**
         * @desc nếu chưa populate
         */
        // if (user.roles.includes(volunteerRole._id)) {
        //     return res.status(400).json({ message: "User đã có role volunteer!" });
        // }

        // Thêm role "volunteer" cho user
        _user.roles.push(volunteerRole._id);
        if (!_user.isActive) {
            _user.isActive = true; // Kích hoạt tài khoản sau khi duyệt
        }
        _user.volunteerRequestStatus = "approved";
        await _user.save();

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

        res.status(200).json({ message: "Yêu cầu volunteer đã bị từ chối!" });
    } catch (error) {
        console.error("Lỗi khi từ chối volunteer:", error);
        res.status(500).json({ message: `Lỗi máy chủ: ${error.message}` });
    }
};

/**
 * @desc Admin Xóa role volunteer ()
 */
export const revokeVolunteerRole = async (req, res) => {
    try {
        const { userId } = req.body;

        const [_user, volunteerRole] = await Promise.all([
            user.findById(userId),
            Role.findOne({ name: "volunteer" }).select("_id")
        ]);
        if (!_user) return res.status(404).json({ message: "Người dùng không tồn tại!" });
        if (!volunteerRole) return res.status(400).json({ message: "Role 'volunteer' chưa được tạo!" });

        if (!_user.roles.includes(volunteerRole._id)) {
            return res.status(400).json({ message: "Người dùng không có volunteer role!" });
        }

        _user.roles = _user.roles.filter(role => role.toString() !== volunteerRole._id.toString());
        await _user.save();

        return res.status(200).json({ message: "Quyền volunteer đã bị thu hồi!" });
    } catch (error) {
        console.error("Lỗi khi thu hồi quyền volunteer:", error);
        res.status(500).json({ message: `Lỗi máy chủ: ${error.message}` });
    }
};



// add new buy package 
export const addNewPackage = async (req, res) => {
    try {
        const { package_id, name, description, price, duration, currency } = req.body;

        const packageData = {
            package_id,
            name,
            description,
            price,
            duration,
            currency
        }
        const result = await createPackage(packageData);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json({ message: "Thêm mới gói dịch vụ thành công!", package: result.data });

    }
    catch (error) {
        console.error("Lỗi khi thêm mới gói dịch vụ:", error);
        return res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
}