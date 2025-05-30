import PetRescueMissionHistory from "../models/PetRescueMissionHistory.js";
import User from "../models/user.js";
import NotificationSchema from "../models/NotificationSchema.js";
import { sendMailNotification } from "../services/sendMailService/nodeMailer.service.js";

/**
 * Kiểm tra và xử lý các mission đã hết thời gian chờ
 */
export const checkMissionTimeouts = async () => {
    try {
        console.log(`[${new Date().toISOString()}] Checking for mission timeouts...`);
        
        const expiredMissions = await PetRescueMissionHistory.find({
            status: 'pending',
            timeoutAt: { $lte: new Date() }
        }).populate('requester').populate('selectedVolunteers');
        
        console.log(`Found ${expiredMissions.length} expired missions`);
        
        for (const mission of expiredMissions) {
            mission.status = 'timeout';
            mission.endedAt = new Date();
            await mission.save();
            
            if (mission.requester) {
                await NotificationSchema.create({
                    userId: mission.requester._id.toString(),
                    type: 'warning',
                    title: 'Yêu cầu cứu hộ đã hết hạn ⏰',
                    message: `Yêu cầu cứu hộ của bạn (Mã: ${mission.missionId}) đã hết thời gian chờ và không có tình nguyện viên nhận nhiệm vụ.`,
                    priority: 'medium',
                    relatedTo: 'rescue_mission',
                    relatedId: mission.missionId,
                    metadata: {
                        missionId: mission.missionId,
                        timeoutAt: mission.timeoutAt,
                        location: mission.location
                    },
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Hết hạn sau 7 ngày
                });
                
                // Gửi email thông báo
                await sendMailNotification({
                    email: mission.requester.email,
                    subject: 'Yêu Cầu Cứu Hộ Đã Hết Hạn',
                    text: `Yêu cầu cứu hộ của bạn đã hết thời gian chờ`,
                    html: `
                        <p>Xin chào ${mission.requester.fullname},</p>
                        <p>Yêu cầu cứu hộ của bạn (Mã: ${mission.missionId}) đã hết thời gian chờ và không có tình nguyện viên nhận nhiệm vụ.</p>
                        <p>Bạn có thể tạo yêu cầu mới nếu vẫn cần hỗ trợ.</p>
                    `
                });
            }
            
            // Thông báo cho các tình nguyện viên đã được chọn
            if (mission.selectedVolunteers && mission.selectedVolunteers.length > 0) {
                for (const volunteer of mission.selectedVolunteers) {
                    await NotificationSchema.create({
                        userId: volunteer._id.toString(),
                        type: 'info',
                        title: 'Nhiệm vụ cứu hộ đã hết hạn',
                        message: `Nhiệm vụ cứu hộ (Mã: ${mission.missionId}) đã hết thời gian chờ phản hồi.`,
                        priority: 'low',
                        relatedTo: 'rescue_mission',
                        relatedId: mission.missionId,
                        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Hết hạn sau 3 ngày
                    });
                }
            }
            
            console.log(`Mission ${mission.missionId} marked as timeout`);
        }
    } catch (error) {
        console.error('Error checking mission timeouts:', error);
    }
};

/**
 * Kiểm tra và giải phóng các mission bị khóa quá lâu
 */
export const checkMissionLocks = async () => {
    try {
        console.log(`[${new Date().toISOString()}] Checking for expired mission locks...`);
        
        const expiredLocks = await PetRescueMissionHistory.find({
            isLocked: true,
            lockExpiresAt: { $lte: new Date() }
        });
        
        console.log(`Found ${expiredLocks.length} expired locks`);
        
        for (const mission of expiredLocks) {
            mission.isLocked = false;
            mission.lockExpiresAt = null;
            await mission.save();
            
            console.log(`Lock released for mission ${mission.missionId}`);
        }
    } catch (error) {
        console.error('Error checking mission locks:', error);
    }
};

export const startMissionTimeoutJob = () => {
    checkMissionTimeouts();
    checkMissionLocks();

    setInterval(checkMissionTimeouts, 60 * 1000);
    setInterval(checkMissionLocks, 30 * 1000);
    
    console.log(`[${new Date().toISOString()}] Mission timeout job started`);
};