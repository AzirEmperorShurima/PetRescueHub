import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    relatedTo: { type: String },
    relatedId: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
    expiresAt: { type: Date }
});

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


export const createNotificationModel = (io) => {
    notificationSchema.post("save", async function (doc) {
        try {
            const maxRetries = 3;
            let retryCount = 0;
            
            const emitNotification = async () => {
                try {
                    const socketId = io.sockets.sockets.get(doc.userId);
                    if (socketId) {
                        const delivered = await new Promise((resolve) => {
                            io.to(socketId).emit("notification", doc, (ack) => {
                                resolve(ack);
                            });
                            setTimeout(() => resolve(false), 5000);
                        });

                        if (delivered) {
                            console.log(`✅ Notification delivered to user ${doc.userId}`);
                        } else {
                            throw new Error("Notification delivery timeout");
                        }
                    } else {
                        console.log(`⚠️ User ${doc.userId} is offline, notification saved to DB`);
                    }
                } catch (error) {
                    throw error;
                }
            };

            while (retryCount < maxRetries) {
                try {
                    await emitNotification();
                    break;
                } catch (error) {
                    retryCount++;
                    console.error(`❌ Retry ${retryCount}/${maxRetries} failed:`, error);
                    if (retryCount === maxRetries) {
                        console.error(`❌ Failed to deliver notification after ${maxRetries} attempts`);
                    } else {

                        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                    }
                }
            }
        } catch (err) {
            console.error("Socket emit notification failed:", err);
        }
    });

    notificationSchema.methods.markAsRead = async function() {
        this.isRead = true;
        return this.save();
    };

    notificationSchema.statics.getUnreadBatch = async function(userId, limit = 10) {
        return this.find({
            userId,
            isRead: false,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: { $gt: new Date() } }
            ]
        })
        .sort({ priority: -1, createdAt: -1 })
        .limit(limit);
    };
}

export default mongoose.model("Notification", notificationSchema);