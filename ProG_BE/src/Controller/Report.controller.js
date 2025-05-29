import Report from "../models/Report.js";
import mongoose from "mongoose";
import user from "../models/user.js";
import { PostModel } from "../models/PostSchema.js";
import { CommentModel } from "../models/CommentsSchema.js";


export const createReport = async (req, res) => {
    try {
        const { targetId, reason, reportType, details } = req.body;
        const reporter = req.user._id;

        // Kiểm tra các trường bắt buộc
        if (!targetId || !reason || !reportType) {
            return res.status(400).json({ message: "Thiếu các trường bắt buộc: targetId, reason hoặc reportType" });
        }

        if (!mongoose.Types.ObjectId.isValid(targetId)) {
            return res.status(400).json({ message: "targetId không hợp lệ" });
        }

        // Kiểm tra loại báo cáo và đối tượng báo cáo
        let targetExists = false;

        if (reportType === "User") {
            const targetUser = await user.findById(targetId);
            targetExists = !!targetUser;
        } else if (reportType === "Post") {
            const targetPost = await PostModel.findById(targetId);
            targetExists = !!targetPost;
        } else if (reportType === "Comment") {
            const targetComment = await Comment.findById(targetId);
            targetExists = !!targetComment;
        }

        if (!targetExists) {
            return res.status(404).json({ message: `Không tìm thấy đối tượng báo cáo (${reportType})` });
        }

        // Kiểm tra xem người dùng đã báo cáo đối tượng này chưa
        const existingReport = await Report.findOne({
            reporter: reporter,
            targetId: targetId,
            status: { $in: ["Pending", "Reviewed"] }
        });

        if (existingReport) {
            return res.status(400).json({
                message: "Bạn đã báo cáo đối tượng này và báo cáo đang được xử lý",
                report: existingReport
            });
        }

        const report = new Report({
            reporter,
            targetId,
            reportType,
            reason,
            details: details || ""
        });

        await report.save();
        res.status(201).json({ message: "Báo cáo đã được gửi thành công", report });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách báo cáo của người dùng hiện tại
export const getUserReports = async (req, res) => {
    try {
        const userId = req.user._id;
        const reports = await Report.find({ reporter: userId })
            .sort({ createdAt: -1 })
            .populate("reviewedBy", "username");

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Hủy báo cáo (chỉ khi báo cáo đang ở trạng thái Pending)
export const cancelReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const userId = req.user._id;

        const report = await Report.findOne({
            _id: reportId,
            reporter: userId,
            status: "Pending"
        });

        if (!report) {
            return res.status(404).json({
                message: "Không tìm thấy báo cáo hoặc báo cáo không thể hủy"
            });
        }

        await Report.deleteOne({ _id: reportId });
        res.status(200).json({ message: "Đã hủy báo cáo thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};