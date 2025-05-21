import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import user from "../models/user.js";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME } from '../Config/redis.config.js';

const connection = new IORedis({
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    host: REDIS_HOST,
    port: REDIS_PORT,
    maxRetriesPerRequest: null,
    connectTimeout: 10000,        // Tăng thời gian timeout kết nối lên 10s
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    },
    reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true;
        }
        return false;
    }
});

// Thêm event listener để theo dõi trạng thái kết nối
connection.on('connect', () => {
    console.log('✅ Kết nối Redis thành công!');
});

connection.on('error', (error) => {
    console.error('❌ Lỗi kết nối Redis:', error);
});

const cleanupQueue = new Queue("cleanupQueue", { connection });

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
}, { connection });

