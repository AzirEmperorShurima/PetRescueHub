import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người gửi
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người nhận
    content: { type: String, required: true }, // Nội dung tin nhắn
    isRead: { type: Boolean, default: false }, // Đã đọc hay chưa
    createdAt: { type: Date, default: Date.now } // Thời gian gửi
});

export default mongoose.model("Message", MessageSchema);
