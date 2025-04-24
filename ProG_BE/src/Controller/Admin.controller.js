import { COOKIE_PATHS } from "../../config.js";
import Role from "../models/Role.js";
import user from "../models/user.js";
import { createPackage } from "../services/PackageService/PackageService.js";
import { getUserIdFromCookies } from "../services/User/User.service.js";


/**
 * @desc Lấy danh sách người dùng (Chỉ Admin)
 */
export const getUsers = async (req, res) => {
    try {
        // Lấy ID từ token trong cookie
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
        }

        // Tìm user từ DB
        const requestingUser = await user.findById(userId).populate('roles', 'name');
        if (!requestingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isAdmin = requestingUser.roles?.some(role => role.name === 'admin');
        if (!isAdmin) {
            return res.status(403).json({ message: "You are not authorized to access this resource" });
        }

        // Lấy danh sách người dùng, ẩn các thông tin nhạy cảm
        const users = await user.find({}, '-password -tokens -__v')
            .populate("roles", "name")
            .lean(); // plain JS object

        return res.status(200).json({
            count: users.length,
            users
        });

    } catch (error) {
        console.error('Error in getUsers:', error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


/**
 * @desc Xóa người dùng (Chỉ Admin)
 */
export const deleteUser = async (req, res) => {
    try {
        const { id_delete } = req.body;

        // Lấy user ID từ token cookie
        const currentUserId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName);
        if (!currentUserId) {
            return res.status(403).json({ message: "Bạn không có quyền xóa người dùng!" });
        }

        // Tìm người dùng hiện tại và kiểm tra quyền
        const currentUser = await user.findById(currentUserId).populate("roles", "name");
        if (!currentUser) {
            return res.status(404).json({ message: "Tài khoản hiện tại không tồn tại!" });
        }

        const isAdmin = currentUser.roles.some(role => role.name === "admin");
        if (!isAdmin) {
            return res.status(403).json({ message: "Bạn không có quyền xóa người dùng!" });
        }

        // Không cho phép admin tự xóa chính mình
        if (currentUserId === id_delete) {
            return res.status(400).json({ message: "Bạn không thể tự xóa chính mình!" });
        }

        // Tiến hành xóa người dùng
        const deletedUser = await user.findByIdAndDelete(id_delete);
        if (!deletedUser) {
            return res.status(404).json({ message: "Người dùng không tồn tại!" });
        }

        return res.status(200).json({ message: "Xóa người dùng thành công!" });

    } catch (error) {
        console.error("❌ Error in deleteUser:", error);
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

/**
 * @desc Admin duyệt volunteer (Thêm role volunteer)
 */

export const acceptApproveVolunteer = async (req, res) => {
    try {

        const userId = getUserIdFromCookies(req);
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
        // _user.roles = [...new Set([...user.roles, volunteerRole._id])];
        if (_user.roles.includes(volunteerRole._id)) {
            return res.status(400).json({ message: "Người dùng đã là volunteer!" });
        }
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