import { Queue, Worker } from 'bullmq';
import { ioRedisClient } from '../Config/redis.client.js';
import { prepareForDatabase } from '../Moderator/Utils/PrepareConvert.js';
import { PostModel } from '../models/PostSchema.js';
import user  from '../models/user.js';
import { contentModerationService } from '../Moderator/Service/ContentModerator.service.js';
import { sendMailNotification } from "../services/sendMailService/nodeMailer.service.js";

export const moderationQueue = new Queue('moderationQueue', { connection: ioRedisClient });

new Worker('moderationQueue', async (job) => {
    const { postId, title, content, postType, userId } = job.data;
    console.log(`Processing moderation for postId: ${postId}`);

    try {
    
        const moderationResult = await contentModerationService(title, content);

        // Chuẩn bị dữ liệu để cập nhật
        const { dbEntry } = prepareForDatabase(
            JSON.stringify(moderationResult),
            postId,
            title,
            content,
            userId,
            postType
        );

        // Cập nhật bài viết trong database
        const PostSubModel = PostModel.discriminators[postType] || PostModel;
        const updatedPost = await PostSubModel.findByIdAndUpdate(
            postId,
            {
                $set: {
                    violate_tags: dbEntry.violate_tags,
                    violationDetails: moderationResult.violations,
                    postStatus: dbEntry.postStatus,
                    updatedAt: new Date(),
                }
            },
            { new: true }
        );

        if (!updatedPost) {
            throw new Error('Post not found');
        }

        console.log(`Moderation completed for postId: ${postId}`, updatedPost);

        const userData = await user.findById(userId);
        
        if (updatedPost.postStatus === 'hidden') {
            if (userData && userData.email) {
                console.log(`Sending notification to ${userData.email} for hidden post ${postId}`);
               await sendMailNotification({
                   email: userData.email,
                   subject: `Bài viết "${title}" bị ẩn`,
                   text: `Lý do: ${updatedPost.violationDetails.map(v => `${v.tag}: ${v.reason} (${v.triggerPhrase})`).join(', ')}`,
                   html: `
                        <!DOCTYPE html>
                        <html lang="vi">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <title>Thông báo bài viết bị ẩn</title>
                            <style type="text/css">
                                /* Reset styles */
                                body, table, td, div, p, a { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5; }
                                body { margin: 0; padding: 0; width: 100% !important; }
                                /* Responsive styles */
                                @media only screen and (max-width: 620px) {
                                    .container { width: 100% !important; padding: 10px !important; }
                                    .content { padding: 15px !important; }
                                    .button { display: block !important; width: 100% !important; text-align: center !important; margin: 5px 0 !important; }
                                    .social-icon { width: 24px !important; height: 24px !important; }
                                    .violation-item { padding-left: 0 !important; }
                                    .violation-tag { display: block !important; margin-bottom: 5px !important; }
                                    .violation-trigger { display: inline-block !important; margin-top: 5px !important; }
                                }
                            </style>
                        </head>
                        <body style="margin: 0; padding: 0; background-color: #f6f6f6;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="border-collapse: collapse; background-color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
                                            <!-- Logo Section -->
                                            <tr>
                                                <td align="center" style="padding: 20px 0 10px;">
                                                    <img src="https://i.imgur.com/CJ8HfUK.png" alt="PetRescueHub Logo" style="width: 120px; height: auto;">
                                                </td>
                                            </tr>
                                            
                                            <!-- Header Section -->
                                            <tr>
                                                <td align="center" style="padding: 0 20px 20px;">
                                                    <h1 style="color: #e74c3c; margin: 0; font-size: 24px; font-weight: 600;">THÔNG BÁO BÀI VIẾT BỊ ẨN</h1>
                                                    <div style="width: 80px; height: 4px; background: linear-gradient(to right, #e74c3c, #f39c12); margin: 15px auto; border-radius: 2px;"></div>
                                                </td>
                                            </tr>
                                            
                                            <!-- Content Section -->
                                            <tr>
                                                <td class="content" style="padding: 0 30px 30px;">
                                                    <!-- Greeting -->
                                                    <p style="margin-top: 0; font-size: 16px; color: #2c3e50;">Kính gửi <strong>${userData.fullname || 'Thành viên PetRescueHub'}</strong>,</p>
                                                    <p style="font-size: 16px; line-height: 1.6; color: #2c3e50;">Chúng tôi rất tiếc phải thông báo rằng bài viết của bạn đã bị ẩn do vi phạm quy định cộng đồng của chúng tôi.</p>
                                                    
                                                    <!-- Post Details -->
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; margin: 15px 0; border: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                                        <tr>
                                                            <td style="padding: 15px;">
                                                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                    <tr>
                                                                        <td style="border-left: 4px solid #3498db; padding-left: 15px;">
                                                                            <h3 style="color: #3498db; margin-top: 0; margin-bottom: 10px; font-size: 18px;">Thông tin bài viết</h3>
                                                                            <p style="margin: 10px 0; color: #2c3e50;"><strong>Tiêu đề:</strong> "${title}"</p>
                                                                            <p style="margin: 10px 0; color: #2c3e50;"><strong>Ngày kiểm duyệt:</strong> ${new Date().toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
                                                                            <p style="margin: 10px 0; color: #2c3e50;"><strong>Trạng thái:</strong> <span style="color: #e74c3c; font-weight: bold; background-color: #ffebee; padding: 3px 8px; border-radius: 12px; font-size: 14px;">Đã bị ẩn</span></p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <!-- Violation Details -->
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff3cd; border-radius: 8px; margin: 15px 0; border: 1px solid #ffeeba;">
                                                        <tr>
                                                            <td style="padding: 15px;">
                                                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                    <tr>
                                                                        <td style="border-left: 4px solid #f39c12; padding-left: 15px;">
                                                                            <h3 style="color: #e67e22; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Lý do vi phạm</h3>
                                                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                                ${updatedPost.violationDetails.map(v => `
                                                                                <tr>
                                                                                    <td class="violation-item" style="padding-bottom: 10px; padding-left: 20px;">
                                                                                        <span class="violation-tag" style="color: #e74c3c; font-weight: bold;">${v.tag}:</span> 
                                                                                        <span style="color: #2c3e50;">${v.reason}</span>
                                                                                        <span class="violation-trigger" style="background-color: #f2dede; padding: 2px 5px; border-radius: 3px; font-size: 14px; color: #a94442; margin-left: 5px;">${v.triggerPhrase}</span>
                                                                                    </td>
                                                                                </tr>
                                                                                `).join('')}
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <!-- Guidelines -->
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #d4edda; border-radius: 8px; margin: 15px 0; border: 1px solid #c3e6cb;">
                                                        <tr>
                                                            <td style="padding: 15px;">
                                                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                    <tr>
                                                                        <td style="border-left: 4px solid #28a745; padding-left: 15px;">
                                                                            <h3 style="color: #28a745; margin-top: 0; margin-bottom: 10px; font-size: 18px;">Hướng dẫn</h3>
                                                                            <p style="margin: 10px 0; color: #2c3e50;">Để tránh vi phạm trong tương lai, vui lòng xem lại <a href="#COMMUNITY_GUIDELINES_URL#" style="color: #28a745; text-decoration: none; font-weight: bold;">Quy định Cộng đồng</a> của chúng tôi.</p>
                                                                            <p style="margin: 10px 0; color: #2c3e50;">Nếu bạn cho rằng đây là sự nhầm lẫn, bạn có thể gửi yêu cầu xem xét lại bài viết bằng cách nhấn vào nút "Yêu Cầu Mở Lại Bài Viết" bên dưới.</p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <!-- CTA Buttons -->
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                                                        <tr>
                                                            <td align="center">
                                                                <a href="#EDIT_POST_URL#" class="button" style="text-decoration: none; color: #ffffff; background: #3498db; padding: 10px 20px; border-radius: 50px; margin: 5px; display: inline-block; font-size: 14px; font-weight: 600; box-shadow: 0 2px 5px rgba(0,0,0,0.1); min-width: 120px;">✏️ Chỉnh Sửa Bài Viết</a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center" style="padding-top: 10px;">
                                                                <a href="#REQUEST_UNHIDE_URL#/${postId}" class="button" style="text-decoration: none; color: #ffffff; background: #9b59b6; padding: 10px 20px; border-radius: 50px; margin: 5px; display: inline-block; font-size: 14px; font-weight: 600; box-shadow: 0 2px 5px rgba(0,0,0,0.1); min-width: 120px;">🔍 Yêu Cầu Mở Lại Bài Viết</a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center" style="padding-top: 10px;">
                                                                <a href="#COMMUNITY_GUIDELINES_URL#" class="button" style="text-decoration: none; color: #ffffff; background: #e67e22; padding: 10px 20px; border-radius: 50px; margin: 5px; display: inline-block; font-size: 14px; font-weight: 600; box-shadow: 0 2px 5px rgba(0,0,0,0.1); min-width: 120px;">📋 Xem Quy Định Cộng Đồng</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            
                                            <!-- Social Media Links -->
                                            <tr>
                                                <td style="text-align: center; padding: 0 30px 20px;">
                                                    <p style="color: #7f8c8d; font-size: 14px; margin-bottom: 10px;">Theo dõi chúng tôi trên mạng xã hội</p>
                                                    <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://i.imgur.com/QV2cR68.png" alt="Facebook" class="social-icon" style="width: 24px; height: 24px;"></a>
                                                    <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://i.imgur.com/0LPK4Qx.png" alt="Twitter" class="social-icon" style="width: 24px; height: 24px;"></a>
                                                    <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://i.imgur.com/P6vV0X6.png" alt="Instagram" class="social-icon" style="width: 24px; height: 24px;"></a>
                                                </td>
                                            </tr>
                                            
                                            <!-- Footer with Unsubscribe -->
                                            <tr>
                                                <td style="text-align: center; padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #eee;">
                                                    <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0;">Trân trọng,</p>
                                                    <p style="color: #2c3e50; font-size: 16px; font-weight: bold; margin: 5px 0;">PetRescueHub Team</p>
                                                    <p style="color: #95a5a6; font-size: 12px; margin-top: 15px;">© ${new Date().getFullYear()} PetRescueHub. Tất cả các quyền được bảo lưu.</p>
                                                    <p style="color: #95a5a6; font-size: 12px; margin-top: 10px;">
                                                        Nếu bạn không muốn nhận email này, <a href="#" style="color: #3498db; text-decoration: none;">hủy đăng ký</a> tại đây.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                   `
               });
            }
        } else if (updatedPost.postStatus === 'public') {
            if (userData && userData.email) {
                console.log(`Sending notification to ${userData.email} for published post ${postId}`);
                await sendMailNotification({
                    email: userData.email,
                    subject: `Bài viết "${title}" đã được đăng thành công`,
                    text: `Bài viết của bạn đã được đăng thành công và hiển thị công khai.`,
                    html: `
                        <!DOCTYPE html>
                        <html lang="vi">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <title>Bài viết đã được đăng thành công</title>
                            <style type="text/css">
                                /* Reset styles */
                                body, table, td, div, p, a { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5; }
                                body { margin: 0; padding: 0; width: 100% !important; }
                                /* Responsive styles */
                                @media only screen and (max-width: 620px) {
                                    .container { width: 100% !important; padding: 10px !important; }
                                    .content { padding: 15px !important; }
                                    .button { display: block !important; width: 100% !important; text-align: center !important; margin: 5px 0 !important; }
                                    .social-icon { width: 24px !important; height: 24px !important; }
                                    .post-image { width: 100% !important; height: auto !important; }
                                    .stats-cell { display: block !important; width: 100% !important; margin-bottom: 10px !important; }
                                    .step-row td { display: block !important; width: 100% !important; }
                                    .step-number { margin-bottom: 5px !important; }
                                }
                            </style>
                        </head>
                        <body style="margin: 0; padding: 0; background-color: #f6f6f6;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="border-collapse: collapse; background-color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
                                            <!-- Logo Section -->
                                            <tr>
                                                <td align="center" style="padding: 20px 0 10px;">
                                                    <img src="https://i.imgur.com/CJ8HfUK.png" alt="PetRescueHub Logo" style="width: 120px; height: auto;">
                                                </td>
                                            </tr>
                                            
                                            <!-- Header Section -->
                                            <tr>
                                                <td align="center" style="padding: 0 20px 20px;">
                                                    <h1 style="color: #27ae60; margin: 0; font-size: 24px; font-weight: 600;">BÀI VIẾT ĐÃ ĐƯỢC ĐĂNG THÀNH CÔNG</h1>
                                                    <div style="width: 80px; height: 4px; background: linear-gradient(to right, #27ae60, #2ecc71); margin: 15px auto; border-radius: 2px;"></div>
                                                </td>
                                            </tr>
                                            
                                            <!-- Content Section -->
                                            <tr>
                                                <td class="content" style="padding: 0 30px 30px;">
                                                    <!-- Greeting -->
                                                    <p style="margin-top: 0; font-size: 16px; color: #2c3e50;">Kính gửi <strong>${userData.fullname || 'Thành viên PetRescueHub'}</strong>,</p>
                                                    <p style="font-size: 16px; line-height: 1.6; color: #2c3e50;">Chúng tôi vui mừng thông báo rằng bài viết của bạn đã được kiểm duyệt và đăng thành công!</p>
                                                    
                                                    <!-- Post Details with Image Preview -->
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; margin: 15px 0; border: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                                        <tr>
                                                            <td style="padding: 15px;">
                                                                <h3 style="color: #3498db; margin-top: 0; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Thông tin bài viết</h3>
                                                                <p style="margin: 10px 0; color: #2c3e50;"><strong>Tiêu đề:</strong> "${title}"</p>
                                                                <p style="margin: 10px 0; color: #2c3e50;"><strong>Ngày đăng:</strong> ${new Date().toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
                                                                <p style="margin: 10px 0; color: #2c3e50;"><strong>Trạng thái:</strong> <span style="color: #27ae60; font-weight: bold; background-color: #e8f5e9; padding: 3px 8px; border-radius: 12px; font-size: 14px;">Đã đăng công khai</span></p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <!-- Success Message with Icon -->
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e8f5e9; border-radius: 8px; margin: 15px 0; border: 1px solid #c8e6c9;">
                                                        <tr>
                                                            <td style="padding: 15px;">
                                                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                    <tr>
                                                                        <td width="40" valign="top">
                                                                            <div style="background-color: #27ae60; border-radius: 50%; width: 30px; height: 30px; text-align: center; line-height: 30px;">
                                                                                <span style="color: white; font-size: 16px;">✓</span>
                                                                            </div>
                                                                        </td>
                                                                        <td style="padding-left: 10px;">
                                                                            <h3 style="color: #2e7d32; margin-top: 0; margin-bottom: 5px; font-size: 16px;">Bài viết của bạn hiện đã hiển thị công khai</h3>
                                                                            <p style="margin: 5px 0 0; color: #2c3e50; font-size: 14px;">Cảm ơn bạn đã đóng góp nội dung cho cộng đồng PetRescueHub.</p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <!-- Stats Preview -->
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f8e9; border-radius: 8px; margin: 15px 0; border: 1px solid #dcedc8;">
                                                        <tr>
                                                            <td style="padding: 15px; text-align: center;">
                                                                <h3 style="color: #558b2f; margin-top: 0; margin-bottom: 15px; font-size: 16px;">Thống kê bài viết của bạn</h3>
                                                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                    <tr>
                                                                        <td width="33%" class="stats-cell" style="text-align: center;">
                                                                            <div style="font-size: 20px; font-weight: bold; color: #558b2f;">0</div>
                                                                            <div style="font-size: 12px; color: #7cb342;">Lượt xem</div>
                                                                        </td>
                                                                        <td width="33%" class="stats-cell" style="text-align: center;">
                                                                            <div style="font-size: 20px; font-weight: bold; color: #558b2f;">0</div>
                                                                            <div style="font-size: 12px; color: #7cb342;">Bình luận</div>
                                                                        </td>
                                                                        <td width="33%" class="stats-cell" style="text-align: center;">
                                                                            <div style="font-size: 20px; font-weight: bold; color: #558b2f;">0</div>
                                                                            <div style="font-size: 12px; color: #7cb342;">Lượt thích</div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <!-- Next Steps with Icons -->
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e3f2fd; border-radius: 8px; margin: 15px 0; border: 1px solid #bbdefb;">
                                                        <tr>
                                                            <td style="padding: 15px;">
                                                                <h3 style="color: #1976d2; margin-top: 0; margin-bottom: 15px; font-size: 16px;">Bước tiếp theo</h3>
                                                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                    <tr class="step-row">
                                                                        <td width="30" valign="top" class="step-number" style="padding-bottom: 10px;">
                                                                            <span style="background-color: #1976d2; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-block; text-align: center; line-height: 24px;">1</span>
                                                                        </td>
                                                                        <td style="padding-bottom: 10px; padding-left: 10px;">
                                                                            <span style="font-size: 14px; color: #2c3e50;">Theo dõi và phản hồi các bình luận trên bài viết của bạn</span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr class="step-row">
                                                                        <td width="30" valign="top" class="step-number" style="padding-bottom: 10px;">
                                                                            <span style="background-color: #1976d2; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-block; text-align: center; line-height: 24px;">2</span>
                                                                        </td>
                                                                        <td style="padding-bottom: 10px; padding-left: 10px;">
                                                                            <span style="font-size: 14px; color: #2c3e50;">Chia sẻ bài viết của bạn với bạn bè và mạng xã hội</span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr class="step-row">
                                                                        <td width="30" valign="top" class="step-number">
                                                                            <span style="background-color: #1976d2; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-block; text-align: center; line-height: 24px;">3</span>
                                                                        </td>
                                                                        <td style="padding-left: 10px;">
                                                                            <span style="font-size: 14px; color: #2c3e50;">Tiếp tục đóng góp nội dung chất lượng cho cộng đồng</span>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- CTA Buttons -->
                                            <tr>
                                                <td style="text-align: center; padding: 0 30px 20px;">
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td align="center">
                                                                <a href="#POST_URL#" class="button" style="text-decoration: none; color: #ffffff; background: #3b5998; padding: 10px 20px; border-radius: 50px; margin: 5px; display: inline-block; font-size: 14px; font-weight: 600; box-shadow: 0 2px 5px rgba(0,0,0,0.1); min-width: 120px;">👁️ Xem Bài Viết</a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center" style="padding-top: 10px;">
                                                                <a href="#NEW_POST_URL#" class="button" style="text-decoration: none; color: #ffffff; background: #2ecc71; padding: 10px 20px; border-radius: 50px; margin: 5px; display: inline-block; font-size: 14px; font-weight: 600; box-shadow: 0 2px 5px rgba(0,0,0,0.1); min-width: 120px;">✏️ Tạo Bài Viết Mới</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Social Media Links -->
                                            <tr>
                                                <td style="text-align: center; padding: 0 30px 20px;">
                                                    <p style="color: #7f8c8d; font-size: 14px; margin-bottom: 10px;">Theo dõi chúng tôi trên mạng xã hội</p>
                                                    <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://i.imgur.com/QV2cR68.png" alt="Facebook" class="social-icon" style="width: 24px; height: 24px;"></a>
                                                    <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://i.imgur.com/0LPK4Qx.png" alt="Twitter" class="social-icon" style="width: 24px; height: 24px;"></a>
                                                    <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://i.imgur.com/P6vV0X6.png" alt="Instagram" class="social-icon" style="width: 24px; height: 24px;"></a>
                                                </td>
                                            </tr>

                                            <!-- Footer with Unsubscribe -->
                                            <tr>
                                                <td style="text-align: center; padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #eee;">
                                                    <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0;">Trân trọng,</p>
                                                    <p style="color: #2c3e50; font-size: 16px; font-weight: bold; margin: 5px 0;">PetRescueHub Team</p>
                                                    <p style="color: #95a5a6; font-size: 12px; margin-top: 15px;">© ${new Date().getFullYear()} PetRescueHub. Tất cả các quyền được bảo lưu.</p>
                                                    <p style="color: #95a5a6; font-size: 12px; margin-top: 10px;">
                                                        Nếu bạn không muốn nhận email này, <a href="#" style="color: #3498db; text-decoration: none;">hủy đăng ký</a> tại đây.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                    `
                });
            }
        }

        return { success: true, post: updatedPost };
    } catch (error) {
        console.error(`Error processing moderation for postId: ${postId}`, error);
        await PostModel.findByIdAndUpdate(postId, {
            $set: {
                violate_tags: ['NO_RESPONSE_VIOLATE'],
                violationDetails: [{
                    tag: "NO_RESPONSE_VIOLATE",
                    reason: "Model failed to respond or error occurred",
                    triggerPhrase: ""
                }],
                postStatus: 'hidden',
                updatedAt: new Date(),
            }
        });
        throw error;
    }
}, { connection: ioRedisClient });


moderationQueue.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed for postId: ${job.data.postId}`, error);
});