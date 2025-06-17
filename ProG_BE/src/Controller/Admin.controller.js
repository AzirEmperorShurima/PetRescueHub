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
import mongoose from "mongoose";


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
        _user.volunteerRequestStatus = "none";
        _user.volunteerStatus = "none"
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
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Validate query parameters
        const filter = {};
        if (status) {
            if (!["Pending", "Reviewed", "Resolved"].includes(status)) {
                return res.status(400).json({ message: "Trạng thái không hợp lệ" });
            }
            filter.status = status;
        }
        if (reportType) {
            if (!["User", "Post", "Comment"].includes(reportType)) {
                return res.status(400).json({ message: "Loại báo cáo không hợp lệ" });
            }
            filter.reportType = reportType;
        }

        // Fetch reports with population based on reportType
        const reports = await Report.find(filter)
            .populate({
                path: "reporter",
                select: "username email avatar",
                match: { _id: { $exists: true } } // Ensure reporter exists
            })
            .populate({
                path: "reviewedBy",
                select: "username email",
                match: { _id: { $exists: true } } // Ensure reviewedBy exists
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(); // Use lean() for performance, since we’ll manually populate targetId

        // Manually populate targetId based on reportType
        const detailedReports = await Promise.all(
            reports.map(async (report) => {
                let targetId = null;

                // Populate targetId based on reportType
                if (report.reportType === "User") {
                    targetId = await mongoose.model("User").findById(report.targetId, "username email avatar").lean();
                } else if (report.reportType === "Post") {
                    targetId = await mongoose.model("Post")
                        .findById(report.targetId, "title content author")
                        .populate({ path: "author", model: "User", select: "username email avatar" })
                        .lean();
                } else if (report.reportType === "Comment") {
                    targetId = await mongoose.model("Comment")
                        .findById(report.targetId, "content author post")
                        .populate([
                            { path: "author", model: "User", select: "username email avatar" },
                            { path: "post", model: "Post", select: "title" }
                        ])
                        .lean();
                }

                return {
                    _id: report._id,
                    reporter: report.reporter,
                    targetId: targetId || { _id: report.targetId, deleted: true }, // Handle deleted targets
                    reportType: report.reportType,
                    reason: report.reason,
                    details: report.details,
                    status: report.status,
                    actionTaken: report.actionTaken,
                    reviewedBy: report.reviewedBy,
                    reviewedAt: report.reviewedAt,
                    adminNote: report.adminNote,
                    createdAt: report.createdAt,
                    updatedAt: report.updatedAt
                };
            })
        );

        // Count total reports
        const total = await Report.countDocuments(filter);

        return res.status(200).json({
            reports: detailedReports,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("Error in getAllReports:", error);
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
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

export const getParticipants = async (req, res) => {
    try {
        const { eventId } = req.body;

        if (!mongoose.isValidObjectId(eventId)) {
            return res.status(400).json({ message: "ID sự kiện không hợp lệ" });
        }

        const event = await EventPost.findById(eventId).populate(
            "participants",
            "username email fullname avatar"
        );
        if (!event) {
            return res.status(404).json({ message: "Không tìm thấy sự kiện" });
        }

        return res.status(200).json({ eventId, participants: event.participants });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách người tham gia", error: error.message });
    }
};


// API: Lấy danh sách nhiệm vụ cứu hộ
export const getRescueMissions = async (req, res) => {
    try {
        const { status, startDate, endDate, latitude, longitude, maxDistance } = req.query;
        const query = {};

        // Lọc theo trạng thái
        if (status) query.status = status;

        // Lọc theo khoảng thời gian
        if (startDate || endDate) {
            query.startedAt = {};
            if (startDate) query.startedAt.$gte = new Date(startDate);
            if (endDate) query.startedAt.$lte = new Date(endDate);
        }

        // Lọc theo vị trí địa lý
        if (latitude && longitude && maxDistance) {
            query.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)],
                    },
                    $maxDistance: parseFloat(maxDistance) * 1000, // Chuyển km thành mét
                },
            };
        }

        const missions = await PetRescueMissionHistory.find(query)
            .populate("requester", "username email fullname")
            .populate("selectedVolunteers", "username email fullname")
            .populate("acceptedVolunteer", "username email fullname")
            .sort({ startedAt: -1 });

        return res.status(200).json({ missions });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách nhiệm vụ cứu hộ", error: error.message });
    }
};

// API: Lấy chi tiết một nhiệm vụ cứu hộ
export const getRescueMissionById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "ID nhiệm vụ không hợp lệ" });
        }

        const mission = await PetRescueMissionHistory.findById(id)
            .populate("requester", "username email fullname")
            .populate("selectedVolunteers", "username email fullname")
            .populate("acceptedVolunteer", "username email fullname");

        if (!mission) {
            return res.status(404).json({ message: "Không tìm thấy nhiệm vụ cứu hộ" });
        }

        return res.status(200).json({ mission });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy chi tiết nhiệm vụ", error: error.message });
    }
};

// API: Hủy nhiệm vụ cứu hộ
export const cancelRescueMission = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNote } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "ID nhiệm vụ không hợp lệ" });
        }

        const mission = await PetRescueMissionHistory.findById(id);
        if (!mission) {
            return res.status(404).json({ message: "Không tìm thấy nhiệm vụ cứu hộ" });
        }

        if (mission.status === "cancelled") {
            return res.status(400).json({ message: "Nhiệm vụ đã bị hủy trước đó" });
        }

        mission.status = "cancelled";
        mission.endedAt = new Date();
        mission.notes = adminNote || mission.notes || "Hủy bởi admin";

        await mission.save();

        return res.status(200).json({ message: "Hủy nhiệm vụ thành công", mission });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi hủy nhiệm vụ", error: error.message });
    }
};

// API: Khóa/mở khóa nhiệm vụ cứu hộ
export const toggleLockRescueMission = async (req, res) => {
    try {
        const { id } = req.params;
        const { isLocked, lockExpiresAt } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "ID nhiệm vụ không hợp lệ" });
        }

        const mission = await PetRescueMissionHistory.findById(id);
        if (!mission) {
            return res.status(404).json({ message: "Không tìm thấy nhiệm vụ cứu hộ" });
        }

        mission.isLocked = isLocked !== undefined ? isLocked : !mission.isLocked;
        mission.lockExpiresAt = lockExpiresAt ? new Date(lockExpiresAt) : mission.lockExpiresAt;

        await mission.save();

        return res.status(200).json({ message: `Nhiệm vụ đã được ${mission.isLocked ? "khóa" : "mở khóa"}`, mission });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi khóa/mở khóa nhiệm vụ", error: error.message });
    }
};

// API: Thống kê nhiệm vụ cứu hộ theo trạng thái
export const getMissionStatsByStatus = async (req, res) => {
    try {
        const stats = await PetRescueMissionHistory.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    status: "$_id",
                    count: 1,
                    _id: 0,
                },
            },
        ]);

        return res.status(200).json({ stats });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi thống kê nhiệm vụ theo trạng thái", error: error.message });
    }
};

// API: Thống kê nhiệm vụ theo khu vực
export const getMissionStatsByArea = async (req, res) => {
    try {
        const { latitude, longitude, maxDistance } = req.query;

        if (!latitude || !longitude || !maxDistance) {
            return res.status(400).json({ message: "Vui lòng cung cấp latitude, longitude và maxDistance" });
        }

        const missions = await PetRescueMissionHistory.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)],
                    },
                    $maxDistance: parseFloat(maxDistance) * 1000, // Chuyển km thành mét
                },
            },
        });

        const stats = await PetRescueMissionHistory.aggregate([
            {
                $match: {
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [parseFloat(longitude), parseFloat(latitude)],
                            },
                            $maxDistance: parseFloat(maxDistance) * 1000,
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    status: "$_id",
                    count: 1,
                    _id: 0,
                },
            },
        ]);

        return res.status(200).json({
            totalMissions: missions.length,
            statsByStatus: stats,
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi thống kê nhiệm vụ theo khu vực", error: error.message });
    }
};

// API: Thống kê số lượng tình nguyện viên tham gia
export const getVolunteerStats = async (req, res) => {
    try {
        const stats = await PetRescueMissionHistory.aggregate([
            {
                $unwind: "$selectedVolunteers",
            },
            {
                $group: {
                    _id: "$selectedVolunteers",
                    missionCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    volunteer: {
                        _id: "$_id",
                        username: "$user.username",
                        email: "$user.email",
                        fullname: "$user.fullname",
                    },
                    missionCount: 1,
                    _id: 0,
                },
            },
            {
                $sort: { missionCount: -1 },
            },
        ]);

        return res.status(200).json({ stats });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi thống kê tình nguyện viên", error: error.message });
    }
};


export const getAllStatistics = async (req, res) => {
    try {

        // Thống kê tổng số bài viết
        const totalPosts = await mongoose.model("Post").countDocuments({ postStatus: { $in: ["public", "pending"] } });

        // Thống kê tổng số thú cưng
        const totalPets = await mongoose.model("PetProfile").countDocuments({ isDeleted: false });

        // Thống kê tổng số người dùng
        const totalUsers = await mongoose.model("User").countDocuments({ isActive: true });

        // Thống kê tổng số tình nguyện viên
        const totalVolunteers = await mongoose.model("User").countDocuments({
            volunteerStatus: { $in: ["alreadyRescue", "not ready"] }
        });

        // Trả về kết quả thống kê
        return res.status(200).json({
            statistics: {
                totalPosts,
                totalPets,
                totalUsers,
                totalVolunteers
            }
        });
    } catch (error) {
        console.error("Error in getStatistics:", error);
        return res.status(500).json({
            message: "Lỗi server khi lấy thống kê",
            error: error.message
        });
    }
};