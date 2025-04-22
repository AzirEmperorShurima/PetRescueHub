// import nodemailer from 'nodemailer';
// import { ADMIN_EMAIL, ADMIN_EMAIL_APP_PASSWORD } from '../../../config.js';

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: ADMIN_EMAIL,
//         pass: ADMIN_EMAIL_APP_PASSWORD,
//     },
// });

// export const sendMailService = async (_mail) => {
//     try {
//         // Kiểm tra đầu vào
//         if (!_mail || !_mail.email || !_mail.username || !_mail.otp) {
//             throw new Error('Missing required fields: email, username, or otp');
//         }

//         // Tạo mailOptions
//         const mailOptions = {
//             from: ADMIN_EMAIL,
//             to: _mail.email,
//             subject: 'Your OTP Code',
//             html: `Hello ${_mail.username},\n\nYour OTP code is: ${_mail.otp}. It will expire in 15 minutes.\n
//             If you don't verified OTP your raw not ACTIVE Account Wil be delete after 7 days
//             \n\nThank you.`,
//         };

//         // Gửi email
//         await transporter.sendMail(mailOptions);
//         console.log('Mail sent successfully!');
//     } catch (error) {
//         console.error('Error sending email:', error.message);
//         throw error;
//     }
// };

// export const sendMailForgotPassword = async (_mail) => {
//     try {
//         if (!_mail || !_mail.email || !_mail.username || !_mail.otp) {
//             throw new Error('Missing required fields: email, username, or otp');
//         }
//         console.log(_mail)

//         const mailOptions = {
//             from: ADMIN_EMAIL,
//             to: _mail.email,
//             subject: 'Your Forgot Password OTP Code - Link to Change Password',
//             text: `Hello ${_mail.username},\n\nYour OTP code is: ${_mail.otp}. It will expire in 15 minutes.\n\n\nThank you.`,
//         };

//         // Gửi email
//         await transporter.sendMail(mailOptions);
//         console.log('Mail sent successfully!');
//     } catch (error) {
//         console.error('Error sending forgot password email:', error.message);
//         throw error;
//     }
// }

// export const sendMailNotification = async (_mail) => {
//     try {
//         if (!_mail || !_mail.email || !_mail.username || !_mail.subject || !_mail.text) {
//             throw new Error('Missing required fields: email, username, or otp');
//         }
//         console.log(_mail)

//         const mailOptions = {
//             from: ADMIN_EMAIL,
//             to: _mail.email,
//             subject: _mail.subject,
//             text: _mail.text,
//             html: _mail.html || "",
//         };

//         // Gửi email
//         await transporter.sendMail(mailOptions);
//         console.log('Mail sent successfully!');
//     } catch (error) {
//         console.error('Error sending forgot password email:', error.message);
//         throw error;
//     }
// }


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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;>
                <h2 style="color: #2c3e50; text-align: center;">Your OTP Code</h2>
                <p>Hello <strong>${_mail.username}</strong>,</p>
                <p style="font-size: 18px;"> 🔐 Your OTP code is: <strong style="color: #e74c3c; font-size: 24px;">${_mail.otp}</strong></p>
                <p>This OTP will expire in <strong>15 minutes</strong>.</p>
                <p>If you don't verify OTP, your inactive account will be deleted after 7 days.</p>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p style="text-align: center; color: #7f8c8d;">Best Regards,<br><strong>Your Company</strong></p>
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
                <p style="text-align: center; color: #7f8c8d;">Best Regards,<br><strong>Your Company</strong></p>
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
                <p style="text-align: center; color: #7f8c8d;">Best Regards,<br><strong>Your Company</strong></p>
            </div>
        `,
    });
};
