
import nodemailer from 'nodemailer';
import { ADMIN_EMAIL, ADMIN_EMAIL_APP_PASSWORD } from '../../../config.js';

// Cấu hình transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ADMIN_EMAIL,
        pass: ADMIN_EMAIL_APP_PASSWORD,
    },
});

// Hàm chung để gửi email
const sendMail = async ({ email, subject, text, html }) => {
    if (!email || !subject || (!text && !html)) {
        throw new Error('Missing required fields: email, subject, and either text or html');
    }

    const mailOptions = {
        from: ADMIN_EMAIL,
        to: email,
        subject,
        text,
        html: html || "",
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error.message);
        throw error;
    }
};

// Gửi email xác nhận OTP
export const sendMailService = async (_mail) => {
    return sendMail({
        email: _mail.email,
        subject: 'Your OTP Code',
        text: `Hello ${_mail.username},\n\nYour OTP code is: ${_mail.otp}. It will expire in 15 minutes.\n
        If you don't verify OTP, your inActivate account will be deleted after 7 days.\n\nThank you.\n
        Best Regards,\n`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #2c3e50; margin: 0; padding: 0; font-size: 24px; font-weight: 600;">Account Activation</h2>
                    <p style="color: #7f8c8d; margin-top: 5px; font-size: 14px;">Please verify your account</p>
                </div>
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <p style="margin-top: 0;">Hello <strong style="color: #3498db;">${_mail.username}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.5;">Thank you for registering. To activate your account, please use the OTP code below:</p>
                    <div style="background-color: #ffffff; border-radius: 6px; border-left: 4px solid #3498db; padding: 15px; margin: 15px 0; text-align: center;">
                        <p style="font-size: 28px; font-weight: bold; color: #e74c3c; margin: 0; letter-spacing: 2px;">${_mail.otp}</p>
                    </div>
                    <p style="color: #7f8c8d; font-size: 14px;">This OTP will expire in <strong>15 minutes</strong>.</p>
                    <p style="color: #e67e22; font-size: 14px; font-style: italic;">⚠️ If you don't verify your account, it will be deleted after 7 days.</p>
                </div>
                <div style="border-top: 1px solid #eee; padding-top: 15px; text-align: center;">
                    <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0;">If you didn't request this email, please ignore it.</p>
                    <p style="color: #7f8c8d; font-size: 14px; margin-top: 15px;">Best Regards,<br><strong>PetRescueHub Team</strong></p>
                </div>
            </div>
        `,
    });
};

// Gửi email quên mật khẩu
export const sendMailForgotPassword = async (_mail) => {
    return sendMail({
        email: _mail.email,
        subject: 'Your Forgot Password OTP Code - Link to Change Password',
        text: `Hello ${_mail.username},\n\nYour OTP code is: ${_mail.otp}. It will expire in 15 minutes.\n\nThank you.`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 15px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header Section -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: 600;">Quên Mật Khẩu?</h1>
                    <p style="color: #7f8c8d; margin-top: 10px; font-size: 16px;">Đừng lo lắng, chúng tôi sẽ giúp bạn!</p>
                </div>

                <!-- Main Content Section -->
                <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                    <p style="margin-top: 0; font-size: 16px;">Xin chào <strong style="color: #3498db;">${_mail.username}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.6;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu từ bạn. Vui lòng sử dụng mã OTP dưới đây để tiếp tục:</p>
                    
                    <!-- OTP Display Box -->
                    <div style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-radius: 10px; border: 2px dashed #3498db; padding: 20px; margin: 25px 0; text-align: center;">
                        <p style="font-size: 32px; font-weight: bold; color: #e74c3c; margin: 0; letter-spacing: 5px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">${_mail.otp}</p>
                        <p style="color: #7f8c8d; font-size: 14px; margin: 10px 0 0;">Mã này sẽ hết hạn sau <strong>15 phút</strong></p>
                    </div>

                    <!-- Security Notice -->
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <p style="color: #856404; margin: 0; font-size: 14px;">
                            <span style="font-size: 18px;">⚠️</span> Vì lý do bảo mật, vui lòng không chia sẻ mã này với bất kỳ ai.
                        </p>
                    </div>
                </div>

                <!-- Footer Section -->
                <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
                    <p style="color: #95a5a6; font-size: 14px; margin: 5px 0;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                    <div style="margin-top: 20px;">
                        <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0;">Trân trọng,</p>
                        <p style="color: #2c3e50; font-size: 16px; font-weight: bold; margin: 5px 0;">PetRescueHub Team</p>
                    </div>
                </div>
            </div>
        `,
    });
};

// Gửi thông báo chung
export const sendMailNotification = async (_mail) => {
    return sendMail({
        email: _mail.email,
        subject: _mail.subject,
        text: _mail.text,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 15px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header Section -->
                <div style="text-align: center; margin-bottom: 25px;">
                    <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: 600;">${_mail.subject}</h1>
                    <div style="width: 50px; height: 3px; background: linear-gradient(to right, #3498db, #2ecc71); margin: 15px auto;"></div>
                </div>

                <!-- Main Content Section -->
                <div style="background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #e0e0e0;">
                    ${_mail.html ? 
                        `<div style="color: #2c3e50; font-size: 16px; line-height: 1.6; text-align: justify;">
                            ${_mail.html}
                        </div>` 
                        : ''
                    }
                </div>

                <!-- Footer Section -->
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
                    <img src="https://i.imgur.com/YckHqaP.png" alt="PetRescueHub Logo" style="width: 120px; margin-bottom: 15px;">
                    <div style="margin-bottom: 15px;">
                        <a href="https://facebook.com/petrescuehub" style="text-decoration: none; color: #3498db; margin: 0 10px;">Facebook</a>
                        <a href="https://twitter.com/petrescuehub" style="text-decoration: none; color: #3498db; margin: 0 10px;">Twitter</a>
                        <a href="https://instagram.com/petrescuehub" style="text-decoration: none; color: #3498db; margin: 0 10px;">Instagram</a>
                    </div>
                    <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0;">Trân trọng,</p>
                    <p style="color: #2c3e50; font-size: 16px; font-weight: bold; margin: 5px 0;">PetRescueHub Team</p>
                    <p style="color: #95a5a6; font-size: 12px; margin-top: 15px;">© 2024 PetRescueHub. All rights reserved.</p>
                </div>
            </div>
        `,
    });
};
