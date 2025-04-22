import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người báo cáo
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID của bài viết, bình luận, user...
    targetType: {
        type: String,
        enum: ["User", "Post", "Question", "Comment", "ForumPost"],
        required: true
    }, // Loại mục tiêu bị báo cáo
    reason: { type: String, required: true }, // Lý do báo cáo
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Resolved"],
        default: "Pending"
    }, // Trạng thái xử lý
    actionTaken: {
        type: String,
        enum: ["None", "Warning", "Temporary Ban", "Permanent Ban", "Content Removed"],
        default: "None"
    }, // Hình thức xử phạt
    adminNote: { type: String }, // Ghi chú từ admin về quyết định xử phạt
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Report", ReportSchema);
