
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
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>${_mail.subject}</title>
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
                                        <img src="https://i.imgur.com/CJ8HfUK.png" alt="PetRescueHub Logo" style="width: 150px; height: auto;">
                                    </td>
                                </tr>
                                
                                <!-- Header Section -->
                                <tr>
                                    <td align="center" style="padding: 0 20px 20px;">
                                        <h1 style="color: #2c3e50; margin: 0; font-size: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">${_mail.subject}</h1>
                                        <div style="width: 80px; height: 4px; background: linear-gradient(to right, #3498db, #2ecc71); margin: 15px auto; border-radius: 2px;"></div>
                                    </td>
                                </tr>
                                
                                <!-- Content Section -->
                                <tr>
                                    <td class="content" style="padding: 0 30px 30px;">
                                        ${_mail.html ? _mail.html : `<p style="color: #2c3e50; font-size: 16px; line-height: 1.8; text-align: justify;">${_mail.text}</p>`}
                                    </td>
                                </tr>
                                
                                <!-- Footer Section -->
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 20px; border-top: 1px solid #eee; text-align: center;">
                                        <!-- Social Media Links -->
                                        <div style="margin-bottom: 15px;">
                                            <a href="https://facebook.com/petrescuehub" style="display: inline-block; margin: 0 5px;">
                                                <img src="https://i.imgur.com/QV2cR68.png" alt="Facebook" class="social-icon" style="width: 32px; height: 32px;">
                                            </a>
                                            <a href="https://twitter.com/petrescuehub" style="display: inline-block; margin: 0 5px;">
                                                <img src="https://i.imgur.com/0LPK4Qx.png" alt="Twitter" class="social-icon" style="width: 32px; height: 32px;">
                                            </a>
                                            <a href="https://instagram.com/petrescuehub" style="display: inline-block; margin: 0 5px;">
                                                <img src="https://i.imgur.com/P6vV0X6.png" alt="Instagram" class="social-icon" style="width: 32px; height: 32px;">
                                            </a>
                                        </div>
                                        
                                        <!-- Copyright -->
                                        <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0;">Trân trọng,</p>
                                        <p style="color: #2c3e50; font-size: 16px; font-weight: bold; margin: 5px 0;">PetRescueHub Team</p>
                                        <p style="color: #95a5a6; font-size: 12px; margin-top: 15px;">© ${new Date().getFullYear()} PetRescueHub. All rights reserved.</p>
                                        
                                        <!-- Unsubscribe Link -->
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
        `,
    });
};
