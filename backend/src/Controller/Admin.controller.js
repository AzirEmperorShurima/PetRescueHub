import Role from "../models/Role.js";
import user from "../models/user.js";
import { getEventsByApprovalStatusService } from "../services/Admin/EventManagement.service.js";
import { createPackage } from "../services/PackageService/PackageService.js";

import * as userManageService from "../services/Admin/UserManagement.service.js";
import * as forumManageService from "../services/Admin/ForumManagement.service.js";
import * as volunteerManageService from "../services/Admin/VolunteerManagement.service.js";
import * as petManageService from "../services/Admin/PetManagement.service.js";
import * as eventManageService from "../services/Admin/EventManagement.service.js";
import * as petRescueManageService from "../services/Admin/PetRescueManagement.service.js";

import PetRescueMissionHistory from "../models/PetRescueMissionHistory.js";
import Report from "../models/Report.js";


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
        const currentUserId = req.user._id.toString();

        if (currentUserId === id_delete) {
            return res.status(400).json({ message: "Invalid request: You cannot delete yourself!" });
        }

        // Kiểm tra user cần xóa có phải là admin không
        const userToDelete = await user.findById(id_delete).populate("roles", "name");
        if (!userToDelete) {
            return res.status(404).json({ message: "User does not exist!" });
        }

        const isUserAdmin = userToDelete.roles.some(role => role.name === "admin" || role.name === "super_admin");

        if (isUserAdmin) {
            const currentUser = await user.findById(currentUserId).populate("roles", "name");
            const isSuperAdmin = currentUser.roles.some(role => role.name === "super_admin");

            if (!isSuperAdmin) {
                return res.status(403).json({
                    message: "Không đủ quyền: Chỉ super_admin mới có thể xóa tài khoản admin!"
                });
            }
        }

        const deletedUser = await user.findByIdAndDelete(id_delete);
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

export const getEventsByApprovalStatus = async (req, res) => {
    try {
        const { status, page, limit } = req.query;
        const result = await getEventsByApprovalStatusService({
            status,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message || "Lỗi server" });
    }
};

export async function getVolunteerStatistics(req, res) {
    try {
        const stats = await volunteerManageService.getAdvancedVolunteerStatistics();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thống kê", error: error.message });
    }
}

export async function getUserStatistics(req, res) {
    try {
        const stats = await volunteerManageService.getComprehensiveUserStatistics();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thống kê", error: error.message });
    }
}

export async function getUserStats(req, res) {
    try {
        const data = await userManageService.getUserStatistics();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi thống kê user", error: err.message });
    }
}

export async function deactivateUser(req, res) {
    const { userId } = req.params;
    try {
        const user = await user.findByIdAndUpdate(userId, { isActive: false }, { new: true });
        if (!user) return res.status(404).json({ message: "User không tồn tại" });
        res.json({ message: "Đã chuyển trạng thái user sang inactive", user });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi vô hiệu hóa user", error: err.message });
    }
}

export const aggregateUserChartData = async (req, res) => {
    try {
        const data = await userManageService.aggregateUserChartData();
        res.status(200).json({ data: data });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi thống kê user", error: err.message });
    }
}

/**
 * Admin cập nhật trạng thái nhiệm vụ
 */
export async function adminManageMission(req, res) {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'cancel', 'lock', 'unlock'

        const mission = await PetRescueMissionHistory.findById(id);
        if (!mission) return res.status(404).json({ message: "Mission not found" });

        if (["completed", "cancelled", "timeout"].includes(mission.status)) {
            return res.status(400).json({ message: "Cannot modify a finalized mission." });
        }

        if (action === "cancel") {
            mission.status = "cancelled";
            mission.endedAt = new Date();
        } else if (action === "lock") {
            mission.isLocked = true;
            mission.lockExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // Lock 1 hour
        } else if (action === "unlock") {
            mission.isLocked = false;
            mission.lockExpiresAt = null;
        } else {
            return res.status(400).json({ message: "Invalid action." });
        }

        await mission.save();
        res.json({ message: "Mission updated", mission });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

//--------------------
// Admin: Lấy danh sách các report
export const getAllReports = async (req, res) => {
    try {
        const { status, reportType, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        // Xây dựng query filter
        const filter = {};
        if (status) filter.status = status;
        if (reportType) filter.reportType = reportType;

        const reports = await Report.find(filter)
            .populate("reporter", "username email avatar")
            .populate([
                {
                    path: "targetId",
                    model: "User",
                    select: "username email isActive isCompromised avatar",
                    match: { _id: { $exists: true } }
                },
                {
                    path: "targetId",
                    model: "Post",
                    select: "title content violate_tags violationDetails author postStatus",
                    match: { _id: { $exists: true } },
                    populate: {
                        path: "author",
                        model: "User",
                        select: "username email avatar"
                    }
                },
                {
                    path: "targetId",
                    model: "Comment",
                    select: "content author post",
                    match: { _id: { $exists: true } },
                    populate: [
                        {
                            path: "author",
                            model: "User",
                            select: "username email avatar"
                        },
                        {
                            path: "post",
                            model: "Post",
                            select: "title"
                        }
                    ]
                }
            ])
            .populate("reviewedBy", "username email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const filteredReports = reports.filter(report => report.targetId !== null);
        const total = await Report.countDocuments(filter);

        res.json({
            reports: filteredReports,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Admin: Cập nhật trạng thái và hành động xử lý
export const updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, actionTaken, adminNote } = req.body;
        const adminId = req.user._id;

        const report = await Report.findById(id);
        if (!report) return res.status(404).json({ message: "Không tìm thấy báo cáo" });

        report.status = status || report.status;
        report.actionTaken = actionTaken || report.actionTaken;
        report.adminNote = adminNote || report.adminNote;

        if ((status === "Reviewed" || status === "Resolved") && report.status !== "Pending") {
            report.reviewedBy = adminId;
            report.reviewedAt = new Date();
        }

        if (actionTaken && actionTaken !== "None") {
            const targetId = report.targetId;
            const reportType = report.reportType;

            if (reportType === "User" && (actionTaken === "Temporary Ban" || actionTaken === "Permanent Ban")) {
                await user.findByIdAndUpdate(targetId, {
                    isActive: false,
                });
            } else if (reportType === "Post" && actionTaken === "Content Removed") {
                await PostModel.findByIdAndUpdate(targetId, {
                    postStatus: "hidden",
                });
            } else if (reportType === "Comment" && actionTaken === "Content Removed") {
                await Comment.findByIdAndUpdate(targetId, {
                    isDeleted: true,
                    content: "[Nội dung đã bị xóa do vi phạm]"
                });
            }
        }

        await report.save();
        res.json({ message: "Đã cập nhật báo cáo", report });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Admin: Lấy thống kê báo cáo
export const getReportStats = async (req, res) => {
    try {
        // Thống kê theo trạng thái
        const statusStats = await Report.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const typeStats = await Report.aggregate([
            {
                $group: {
                    _id: "$reportType",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Thống kê theo hành động đã thực hiện
        const actionStats = await Report.aggregate([
            {
                $group: {
                    _id: "$actionTaken",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Định dạng kết quả
        const formattedStatusStats = {
            Pending: 0,
            Reviewed: 0,
            Resolved: 0,
        };

        const formattedTypeStats = {
            User: 0,
            Post: 0,
            Comment: 0
        };

        const formattedActionStats = {
            None: 0,
            Warning: 0,
            "Temporary Ban": 0,
            "Permanent Ban": 0,
            "Content Removed": 0
        };

        statusStats.forEach(item => {
            if (item._id) formattedStatusStats[item._id] = item.count;
        });

        typeStats.forEach(item => {
            if (item._id) formattedTypeStats[item._id] = item.count;
        });

        actionStats.forEach(item => {
            if (item._id) formattedActionStats[item._id] = item.count;
        });

        // Thống kê theo thời gian (7 ngày gần nhất)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            last7Days.push(date);
        }

        const dailyStats = [];
        for (let i = 0; i < 6; i++) {
            const startDate = last7Days[i];
            const endDate = last7Days[i + 1];

            const count = await Report.countDocuments({
                createdAt: { $gte: startDate, $lt: endDate }
            });

            dailyStats.push({
                date: startDate.toISOString().split('T')[0],
                count
            });
        }

        // Thêm ngày cuối cùng (hôm nay)
        const todayCount = await Report.countDocuments({
            createdAt: { $gte: last7Days[6] }
        });

        dailyStats.push({
            date: last7Days[6].toISOString().split('T')[0],
            count: todayCount
        });

        res.json({
            byStatus: formattedStatusStats,
            byType: formattedTypeStats,
            byAction: formattedActionStats,
            daily: dailyStats,
            total: await Report.countDocuments()
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Admin: Lấy chi tiết báo cáo
export const getReportDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await Report.findById(id)
            .populate("reporter", "username email avatar")
            .populate([
                {
                    path: "targetId",
                    model: "User",
                    select: "username email isActive isCompromised avatar fullname gender biography",
                    match: { _id: { $exists: true } }
                },
                {
                    path: "targetId",
                    model: "Post",
                    select: "title content violate_tags violationDetails author postStatus imgUrl createdAt",
                    match: { _id: { $exists: true } },
                    populate: {
                        path: "author",
                        model: "User",
                        select: "username email avatar"
                    }
                },
                {
                    path: "targetId",
                    model: "Comment",
                    select: "content author post createdAt",
                    match: { _id: { $exists: true } },
                    populate: [
                        {
                            path: "author",
                            model: "User",
                            select: "username email avatar"
                        },
                        {
                            path: "post",
                            model: "Post",
                            select: "title author",
                            populate: {
                                path: "author",
                                model: "User",
                                select: "username"
                            }
                        }
                    ]
                }
            ])
            .populate("reviewedBy", "username email avatar");

        if (!report) {
            return res.status(404).json({ message: "Không tìm thấy báo cáo" });
        }

        if (!report.targetId) {
            return res.status(404).json({ message: "Đối tượng báo cáo không còn tồn tại" });
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


export const approveEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const adminId = req.user._id

        if (!eventId) return res.status(400).json({ message: "EventId Is Required" })
        if (!adminId) return res.status(403).json({ message: "Access Denied" });

        const eventAccept = eventManageService.approveEvent(eventId, adminId);

        res.json({ message: "Event approved successfully", eventAccept });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const rejectEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const adminId = req.user._id;
        if (!eventId) return res.status(400).json({ message: "EventId Is Required" })
        if (!adminId) return res.status(403).json({ message: "Access Denied" });

        const result = await rejectEventService(eventId, adminId);

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const statusCode = err.message === "Event not found" ? 404 : 500;
        res.status(statusCode).json({ success: false, message: err.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const adminId = req.user._id;
        if (!postId) return res.status(400).json({ message: "EventId Is Required" })
        if (!adminId) return res.status(403).json({ message: "Access Denied" });
        const result = await forumManageService.deletePostService(postId, adminId);

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        // Xử lý lỗi
        const statusCode = err.message === "Post not found" ? 404 : 500;
        res.status(statusCode).json({ success: false, message: err.message });
    }
};

export const deleteAllPosts = async (req, res) => {
    try {
        const adminId = req.user._id;
        if (!adminId) {
            return res.status(403).json({ message: "Access Denied" });
        }
        const result = await forumManageService.deleteAllPostsService()

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};