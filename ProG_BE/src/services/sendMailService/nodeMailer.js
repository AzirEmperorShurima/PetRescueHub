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
        If you don't verify OTP, your inActivate account will be deleted after 7 days.\n\nThank you.`,
    });
};

// Gửi email quên mật khẩu
export const sendMailForgotPassword = async (_mail) => {
    return sendMail({
        email: _mail.email,
        subject: 'Your Forgot Password OTP Code - Link to Change Password',
        text: `Hello ${_mail.username},\n\nYour OTP code is: ${_mail.otp}. It will expire in 15 minutes.\n\nThank you.`,
    });
};

// Gửi thông báo chung
export const sendMailNotification = async (_mail) => {
    return sendMail({
        email: _mail.email,
        subject: _mail.subject,
        text: _mail.text,
        html: _mail.html,
    });
};
