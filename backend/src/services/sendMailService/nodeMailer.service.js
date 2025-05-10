
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
        subject: 'Mã OTP Kích Hoạt Tài Khoản',
        text: `Xin chào ${_mail.username},\n\nMã OTP của bạn là: ${_mail.otp}. Mã này sẽ hết hạn sau 15 phút.\n
        Nếu bạn không xác thực OTP, tài khoản chưa kích hoạt sẽ bị xóa sau 7 ngày.\n\nXin cảm ơn.\n
        Trân trọng,\n`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h1 style="color: #2c3e50; margin: 0; padding: 0; font-size: 28px; font-weight: 700;">Xác Thực Tài Khoản</h1>
                    <p style="color: #7f8c8d; margin-top: 10px; font-size: 16px;">Vui lòng xác thực để kích hoạt tài khoản của bạn</p>
                </div>
                
                <div style="background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #eaeaea;">
                    <p style="margin-top: 0; font-size: 16px;">Xin chào <strong style="color: #3498db; font-size: 18px;">${_mail.username}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.6;">Cảm ơn bạn đã đăng ký tài khoản. Đây là mã OTP mới của bạn:</p>
                    
                    <div style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
                        <p style="font-size: 32px; font-weight: bold; color: #ffffff; margin: 0; letter-spacing: 5px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">${_mail.otp}</p>
                    </div>
                    
                    <div style="background-color: #fff4e5; border-left: 4px solid #ff9800; padding: 15px; margin: 15px 0; border-radius: 4px;">
                        <p style="color: #e67e22; font-size: 15px; margin: 0;">
                            <strong>⚠️ Lưu ý quan trọng:</strong>
                            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                                <li>Mã OTP sẽ hết hạn sau <strong>15 phút</strong></li>
                                <li>Tài khoản chưa kích hoạt sẽ bị xóa sau <strong>7 ngày</strong></li>
                            </ul>
                        </p>
                    </div>
                </div>
                
                <div style="border-top: 2px solid #eee; padding-top: 20px; text-align: center;">
                    <p style="color: #95a5a6; font-size: 14px; margin: 5px 0;">Nếu bạn không yêu cầu email này, vui lòng bỏ qua.</p>
                    <div style="margin-top: 20px;">
                        <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0;">Trân trọng,</p>
                        <p style="color: #2c3e50; font-size: 16px; font-weight: bold; margin: 5px 0;">PetRescueHub Team</p>
                    </div>
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
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 15px; background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
                <!-- Logo Section -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://i.imgur.com/CJ8HfUK.png" alt="PetRescueHub Logo" style="width: 150px; height: auto;">
                </div>

                <!-- Header Section -->
                <div style="text-align: center; margin-bottom: 25px;">
                    <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">${_mail.subject}</h1>
                    <div style="width: 80px; height: 4px; background: linear-gradient(to right, #3498db, #2ecc71); margin: 15px auto; border-radius: 2px;"></div>
                </div>

                <!-- Main Content Section -->
                <div style="background: #ffffff; border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #e0e0e0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    ${_mail.html ?
                `<div style="color: #2c3e50; font-size: 16px; line-height: 1.8; text-align: justify;">
                            ${_mail.html}
                        </div>`
                : ''
            }
                </div>

                <!-- Footer Section -->
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
                    <div style="margin-bottom: 20px;">
                        <a href="https://facebook.com/petrescuehub" style="text-decoration: none; color: #ffffff; background: #3b5998; padding: 8px 15px; border-radius: 5px; margin: 0 5px; display: inline-block; font-size: 14px;">
                            <img src="https://i.imgur.com/QV2cR68.png" alt="Facebook" style="width: 16px; vertical-align: middle; margin-right: 5px;">Facebook
                        </a>
                        <a href="https://twitter.com/petrescuehub" style="text-decoration: none; color: #ffffff; background: #1da1f2; padding: 8px 15px; border-radius: 5px; margin: 0 5px; display: inline-block; font-size: 14px;">
                            <img src="https://i.imgur.com/0LPK4Qx.png" alt="Twitter" style="width: 16px; vertical-align: middle; margin-right: 5px;">Twitter
                        </a>
                        <a href="https://instagram.com/petrescuehub" style="text-decoration: none; color: #ffffff; background: #e1306c; padding: 8px 15px; border-radius: 5px; margin: 0 5px; display: inline-block; font-size: 14px;">
                            <img src="https://i.imgur.com/P6vV0X6.png" alt="Instagram" style="width: 16px; vertical-align: middle; margin-right: 5px;">Instagram
                        </a>
                    </div>
                    <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0;">Trân trọng,</p>
                    <p style="color: #2c3e50; font-size: 16px; font-weight: bold; margin: 5px 0;">PetRescueHub Team</p>
                    <p style="color: #95a5a6; font-size: 12px; margin-top: 15px;">© ${new Date().getFullYear()} PetRescueHub. All rights reserved.</p>
                </div>
            </div>
        `,
    });
};
