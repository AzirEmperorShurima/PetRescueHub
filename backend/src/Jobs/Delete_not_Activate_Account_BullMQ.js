import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import user from "../models/user.js"; // Import model user

// Kết nối Redis
const connection = new IORedis();

// Tạo queue
const cleanupQueue = new Queue("cleanupQueue", { connection });

// Hàm lên lịch job
async function scheduleCleanupJob() {
    await cleanupQueue.add("deleteUnverified", {}, {
        repeat: { cron: "0 0 * * *", tz: "Asia/Ho_Chi_Minh" } // Chạy lúc 00:00 theo giờ Việt Nam
    });
}

// Worker xử lý job
new Worker("cleanupQueue", async () => {
    console.log("🔥 Đang chạy cron job xóa tài khoản chưa active...");
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const result = await user.deleteMany({
            isActive: false,
            createdAt: { $lt: sevenDaysAgo }
        });

        console.log(`✅ Đã xóa ${result.deletedCount} tài khoản chưa xác minh.`);
    } catch (error) {
        console.error("❌ Lỗi khi xóa tài khoản chưa active:", error);
    }
}, { connection });

// Gọi function để chạy job
scheduleCleanupJob();
