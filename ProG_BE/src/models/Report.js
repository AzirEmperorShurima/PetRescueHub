import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reportType: { 
        type: String, 
        enum: ["User", "Post", "Comment"], 
        required: true 
    },
    reason: { type: String, required: true },
    details: { type: String },
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Resolved"],
        default: "Pending"
    }, // Trạng thái xử lý
    actionTaken: {
        type: String,
        enum: ["None", "Warning", "Temporary Ban", "Permanent Ban", "Content Removed"],
        default: "None"
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    adminNote: { type: String },
}, { timestamps: true });

export default mongoose.model("Report", ReportSchema);
