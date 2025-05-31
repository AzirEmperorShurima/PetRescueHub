import mongoose from "mongoose";
import pkg from "bullmq";
const { Queue, Worker, QueueScheduler } = pkg;
import cron from "node-cron";
import { ioRedisClient } from "../Config/redis.client.js";
import { sendMailNotification } from "../services/sendMailService/nodeMailer.service.js";

// Debug: Kiểm tra import bullmq
console.log("Imported bullmq components:", { Queue, Worker, QueueScheduler });

// Khởi tạo queue của bullmq
const emailQueue = new Queue("emailQueue", { connection: ioRedisClient });

// Hàm gửi email cho một người tham gia
const sendEmailToParticipant = async (participant, event) => {
    try {
        await sendMailNotification({
            email: participant.email,
            subject: `Nhắc nhở: Sự kiện "${event.title}" sắp diễn ra!`,
            text: `Xin chào ${participant.username || "Người tham gia"},\n\nSự kiện ${event.title} sắp diễn ra. Vui lòng chuẩn bị tham gia đúng giờ. Cảm ơn bạn!`,
            html: `
                <div style="background-color: #f7f9fc; padding: 20px 0;">
                    <!-- Banner sự kiện -->
                    <div style="background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; margin-bottom: 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">Nhắc nhở sự kiện</h1>
                        <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 10px;">Sự kiện sắp diễn ra - Đừng bỏ lỡ!</p>
                    </div>
                    
                    <!-- Nội dung chính -->
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <!-- Lời chào -->
                        <p style="font-size: 16px; color: #333; margin-top: 0;">Xin chào <strong style="color: #4CAF50; font-size: 18px;">${participant.username || "Người tham gia"}</strong>,</p>
                        
                        <p style="font-size: 16px; color: #333; line-height: 1.5;">Sự kiện <strong style="color: #4CAF50;">${event.title}</strong> sắp diễn ra. Dưới đây là thông tin chi tiết:</p>
                        
                        <!-- Thông tin sự kiện -->
                        <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <h3 style="color: #4CAF50; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Thông tin sự kiện</h3>
                            
                            <div style="margin-bottom: 10px;">
                                <span style="font-weight: bold; color: #555; display: inline-block; width: 120px;">Tiêu đề:</span>
                                <span style="color: #333;">${event.title}</span>
                            </div>
                            
                            <div style="margin-bottom: 10px;">
                                <span style="font-weight: bold; color: #555; display: inline-block; width: 120px;">Nội dung:</span>
                                <span style="color: #333;">${event.content}</span>
                            </div>
                            
                            <div style="margin-bottom: 10px;">
                                <span style="font-weight: bold; color: #555; display: inline-block; width: 120px;">Thời gian bắt đầu:</span>
                                <span style="color: #333;">${new Date(event.eventStartDate).toLocaleString("vi-VN")}</span>
                            </div>
                            
                            <div style="margin-bottom: 10px;">
                                <span style="font-weight: bold; color: #555; display: inline-block; width: 120px;">Địa điểm:</span>
                                <span style="color: #333;">${event.eventLocation || "Không xác định"}</span>
                            </div>
                        </div>
                        
                        <!-- Nhắc nhở -->
                        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; color: #2e7d32; font-size: 15px;">
                                <strong>⏰ Nhắc nhở:</strong> Vui lòng chuẩn bị tham gia đúng giờ. Chúng tôi rất mong được gặp bạn tại sự kiện!
                            </p>
                        </div>
                        
                        <!-- Lời kết -->
                        <p style="margin-top: 25px; margin-bottom: 5px; color: #555;">Trân trọng,</p>
                        <p style="margin-top: 0; font-weight: bold; color: #333;">Đội ngũ quản lý sự kiện</p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="text-align: center; padding-top: 20px; color: #777; font-size: 13px;">
                        <p>© ${new Date().getFullYear()} PetRescueHub. Tất cả các quyền được bảo lưu.</p>
                    </div>
                </div>
            `
        });
        console.log(`Email sent to ${participant.email} for event ${event._id}`);
    } catch (error) {
        console.error(`Error sending email to ${participant.email}:`, error);
        throw error; // Ném lỗi để bullmq xử lý retry
    }
};

// Hàm chính để gửi email nhắc nhở sự kiện
export const sendEventReminderEmails = async () => {
    try {
        // Thời gian hiện tại và khoảng thời gian gửi nhắc nhở (24 giờ tới)
        const now = new Date();
        const reminderWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // Tìm các EventPost có eventStartDate trong vòng 24 giờ tới và đã được phê duyệt
        const upcomingEvents = await mongoose.model("EventPost").find({
            eventStartDate: {
                $gte: now,
                $lte: reminderWindow
            },
            approvalStatus: "approved",
            postStatus: { $in: ["public", "hidden"] }
        }).populate({
            path: "participants",
            select: "username email"
        }).lean();

        // Thêm job vào queue cho từng email
        for (const event of upcomingEvents) {
            if (event.participants && event.participants.length > 0) {
                for (const participant of event.participants) {
                    if (participant.email) {
                        await emailQueue.add(
                            `send-email-${event._id}-${participant._id}`,
                            {
                                participant,
                                event
                            },
                            {
                                attempts: 3,
                                backoff: {
                                    type: "exponential",
                                    delay: 1000
                                }
                            }
                        );
                    }
                }
            }
        }

        console.log(`Queued emails for ${upcomingEvents.length} upcoming events`);
        return { success: true, message: `Queued emails for ${upcomingEvents.length} events` };
    } catch (error) {
        console.error("Error in sendEventReminderEmails:", error);
        return { success: false, message: "Lỗi server khi xếp hàng email", error: error.message };
    }
};

// Worker để xử lý email
export const setupEmailWorker = () => {
    try {
        const emailWorker = new Worker(
            "emailQueue",
            async (job) => {
                const { participant, event } = job.data;
                await sendEmailToParticipant(participant, event);
            },
            {
                connection: ioRedisClient
            }
        );

        emailWorker.on("completed", (job) => {
            console.log(`Job ${job.id} completed: Email sent to ${job.data.participant.email}`);
        });

        emailWorker.on("failed", (job, error) => {
            console.error(`Job ${job.id} failed for ${job.data.participant.email}:`, error);
        });
    } catch (error) {
        console.error("Error setting up email worker:", error);
    }
};

// Lập lịch chạy job
export const scheduleEventReminderEmails = () => {
    try {
        // Khởi tạo QueueScheduler
        if (!QueueScheduler) {
            throw new Error("QueueScheduler is not available. Check bullmq version.");
        }
        const queueScheduler = new QueueScheduler("emailQueue", { connection: ioRedisClient });

        // Lập lịch chạy mỗi giờ
        cron.schedule("0 0 * * *", async () => {
            console.log("Running sendEventReminderEmails job...");
            try {
                const result = await sendEventReminderEmails();
                console.log("Job result:", result);
            } catch (error) {
                console.error("Error running sendEventReminderEmails:", error);
            }
        });
    } catch (error) {
        console.error("Error scheduling email reminders:", error);
    }
};