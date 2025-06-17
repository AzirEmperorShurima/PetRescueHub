import { Queue, Worker } from "bullmq";
import user from "../models/user.js";
import { ioRedisClient } from '../Config/redis.client.js';

const cleanupQueue = new Queue("cleanupQueue", { connection: ioRedisClient });

export const scheduleCleanupJob = async () => {
    try {
        await cleanupQueue.add("deleteUnverified", {}, {
            repeat: { cron: "0 0 * * *", tz: "Asia/Ho_Chi_Minh" } // Chạy lúc 00:00 theo giờ Việt Nam
        });
        console.log("✅ Job xóa tài khoản chưa active đã được thêm vào queue thành công!");
        console.log("⏰ Job sẽ chạy tự động vào 00:00 hàng ngày (GMT+7)");
    } catch (error) {
        console.error("❌ Lỗi khi thêm job vào queue:", error);
    }
}

new Worker("cleanupQueue", async () => {
    console.log("🔥 Đang chạy cron job xóa tài khoản chưa active...");
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const result = await user.deleteMany({
            isActive: false,
            isCompromised: false,
            createdAt: { $lt: sevenDaysAgo }
        });

        console.log(`✅ Đã xóa ${result.deletedCount} tài khoản chưa xác minh và không bị xâm phạm.`);
    } catch (error) {
        console.error("❌ Lỗi khi xóa tài khoản chưa active:", error);
    }
}, { connection: ioRedisClient });

