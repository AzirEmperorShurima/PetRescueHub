import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, enum: ['info', 'warning', 'success'], default: 'info' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });

// Hàm khởi tạo Schema với io
export const createNotificationModel = (io) => {
    notificationSchema.post("save", async function (doc) {
        try {
            const socketId = io?.onlineUsers?.get(doc.userId);
            if (socketId) {
                io.to(socketId).emit("notification", doc);
            }
        } catch (err) {
            console.error("Socket emit notification failed:", err);
        }
    });
}
export default mongoose.model("Notification", notificationSchema);