import { redisClient } from "../Config/redis.client.js";
import { RoleChecking } from "../utils/auth/authUtils.js";

export const clearVolunteerCache = async (userId) => {
    try {
        const redisKey = `volunteer:permission:${userId}`;
        await redisClient.del(redisKey);
        console.log(`🧹 Cache Redis quyền volunteer đã được xóa cho user ${userId}`);
    } catch (error) {
        console.error("❌ Lỗi khi xóa cache Redis:", error);
    }
};

export const isVolunteer = RoleChecking('volunteer', {
    redisKeyPrefix: 'volunteer',
    cacheTTL: 1800,
    customMessages: {
        noPermission: 'Bạn cần có quyền volunteer để thực hiện hành động này'
    }
});