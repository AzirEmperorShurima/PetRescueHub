import { COOKIE_PATHS, TOKEN_TYPE } from "../../config.js";
import Role from "../models/Role.js";
import user from "../models/user.js";
import { createPackage } from "../services/PackageService/PackageService.js";

/**
 * @desc Lấy danh sách người dùng (Chỉ Admin hoặc Super Admin)
 */
export const getUsers = async (req, res) => {
    try {
        const users = await user.find({}, '-password -tokens -__v')
            .populate("roles", "name")
            .lean();

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
 * @desc Lấy danh sách volunteer (Chỉ Admin hoặc Super Admin)
 */
export const getVolunteers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            isActive,
            search,
            sortBy = "createdAt",
            sortOrder = "desc"
        } = req.query;

        const volunteerRole = await Role.findOne({ name: "volunteer" }).select("_id");
        if (!volunteerRole) {
            return res.status(400).json({ message: "Role 'volunteer' chưa được tạo!" });
        }

        const filter = {
            roles: volunteerRole._id,
            volunteerRequestStatus: "approved"
        };

        if (typeof isActive !== 'undefined') {
            filter.isActive = isActive === 'true';
        }

        if (search) {
            filter.$or = [
                { email: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } }
            ];
        }

        const sortFields = sortBy.split(',');
        const sortOrders = sortOrder.split(',');
        const sort = {};

        sortFields.forEach((field, index) => {
            const order = sortOrders[index]?.toLowerCase() === 'asc' ? 1 : -1;
            sort[field] = order;
        });

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [volunteers, total] = await Promise.all([
            user.find(filter, '-password -tokens -__v')
                .populate("roles", "name")
                .skip(skip)
                .limit(parseInt(limit))
                .sort(sort)
                .lean(),
            user.countDocuments(filter)
        ]);

        return res.status(200).json({
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalVolunteers: total,
            sortBy: sortFields,
            sortOrder: sortOrders,
            volunteers
        });

    } catch (error) {
        console.error('❌ Error in getVolunteers:', error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const _getVolunteers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            isActive,
            search,
            sortBy,
            sortOrder
        } = req.query;

        const volunteerRole = await Role.findOne({ name: "volunteer" }).select("_id");
        if (!volunteerRole) {
            return res.status(400).json({ message: "Role 'volunteer' chưa được tạo!" });
        }

        const filter = {
            roles: volunteerRole._id,
            volunteerRequestStatus: "approved"
        };

        if (typeof isActive !== 'undefined') {
            filter.isActive = isActive === 'true';
        }

        if (search) {
            filter.$or = [
                { email: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } }
            ];
        }

        // ✅ Mặc định nếu không truyền sortBy và sortOrder
        const sortFields = sortBy ? sortBy.split(',') : ['createdAt', 'fullName'];
        const sortOrders = sortOrder ? sortOrder.split(',') : ['desc', 'asc'];

        const sort = {};
        sortFields.forEach((field, index) => {
            const order = sortOrders[index]?.toLowerCase() === 'asc' ? 1 : -1;
            sort[field] = order;
        });

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [volunteers, total] = await Promise.all([
            user.find(filter, '-password -tokens -__v')
                .populate("roles", "name")
                .skip(skip)
                .limit(parseInt(limit))
                .sort(sort)
                .lean(),
            user.countDocuments(filter)
        ]);

        return res.status(200).json({
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalVolunteers: total,
            sortBy: sortFields,
            sortOrder: sortOrders,
            volunteers
        });

    } catch (error) {
        console.error('❌ Error in getVolunteers:', error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


/**
 * @desc Xóa người dùng (Chỉ Admin hoặc Super Admin)
 */
export const deleteUser = async (req, res) => {
    try {
        const { id_delete } = req.body;

        if (currentUserId === id_delete) {
            return res.status(400).json({ message: "Invalid request: You cannot delete yourself!" });
        }

        const deletedUser = await user.findByIdAndDelete(id_delete);
        if (!deletedUser) {
            return res.status(404).json({ message: "User does not exist!" });
        }

        return res.status(200).json({ message: "User deleted successfully!" });

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

        const { userId } = req.body;
        const targetUser = await user.findById(userId).populate("roles");
        if (!targetUser) return res.status(404).json({ message: "Người dùng không tồn tại!" });

        const volunteerRole = await Role.findOne({ name: "volunteer" }).select("_id");
        if (!volunteerRole) return res.status(400).json({ message: "Role 'volunteer' chưa được tạo!" });

        // Kiểm tra xem người dùng đã có role volunteer hay chưa
        const hasVolunteerRole = targetUser.roles.some(role => role._id.equals(volunteerRole._id));
        if (hasVolunteerRole) {
            return res.status(400).json({ message: "Người dùng đã là volunteer!" });
        }

        // Cập nhật role và trạng thái
        targetUser.roles.push(volunteerRole._id);
        if (targetUser.isActive === false) {
            targetUser.isActive = true;
        }
        targetUser.volunteerRequestStatus = "approved";
        await targetUser.save();

        res.json({ message: "Người dùng đã được phê duyệt làm volunteer!" });
    } catch (error) {
        console.error("❌ Error in acceptApproveVolunteer:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


/**
 * @desc Admin từ chối volunteer (không accept role volunteer)
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