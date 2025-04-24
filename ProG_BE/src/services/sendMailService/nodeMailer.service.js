
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
                    <p style="color: #7f8c8d; font-size: 14px; margin-top: 15px;">Best Regards,<br><strong>Your Company</strong></p>
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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #3498db; text-align: center;">Forgot Password Request</h2>
                <p>Hello <strong>${_mail.username}</strong>,</p>
                <p>You have requested to reset your password. Use the OTP code below:</p>
                <p style="font-size: 18px;"> 🚀 Your OTP code is: <strong style="color: #e74c3c; font-size: 24px;">${_mail.otp}</strong></p>
                <p>This OTP will expire in <strong>15 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p style="text-align: center; color: #7f8c8d;">Best Regards,<br><strong>PetRescueHub Team</strong></p>
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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #d35400; text-align: center;">${_mail.subject}</h2>
                <div style="padding: 15px; background: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    ${_mail.html ? `<div style="color: #333; font-size: 16px;">${_mail.html}</div>` : ''}
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
                <p style="text-align: center; color: #7f8c8d;">Best Regards,<br><strong>PetRescueHub Team</strong></p>
            </div>
        `,
    });
};
