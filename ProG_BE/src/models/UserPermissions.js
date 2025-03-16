import mongoose from "mongoose";

const UserPermissionsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    isBanned: { type: Boolean, default: false }, // Cấm hoàn toàn
    canComment: { type: Boolean, default: true }, // Quyền bình luận
    canPostQuestion: { type: Boolean, default: true }, // Quyền đăng câu hỏi
    canPostForum: { type: Boolean, default: true } // Quyền đăng bài trên forum
}, { timestamps: true });

export default mongoose.model("UserPermissions", UserPermissionsSchema);
