import { Router } from "express";
import {
    forgot_password, getProfile, loginHandler, logoutHandler,
    refreshToken, report_compromised_account, resendActivationOTP,
    reset_password, Signup_Handler, verified_OTP,
    verified_OTP_forgot_password
} from "../Controller/Auth.Controller.js";
import { Exist_User_Checking } from "../Middlewares/Signup_Verified.js";
import { verified_Is_Email_Valid } from "../Middlewares/verified_Email_Valid.js";
import { validatePasswordStrength } from "../Middlewares/validatePasswordStrength.js";

const authRouter = Router();

// Middleware chung cho tất cả các routes
authRouter.use((req, res, next) => {
    res.set({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    next();
});

// Route chào mừng
authRouter.get('/', (req, res) => {
    res.status(200).json({
        message: 'Chào mừng đến với API Xác thực',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// Nhóm routes xác thực
authRouter.route('/auth')
    .post('/login', [validatePasswordStrength], loginHandler)
    .post('/logout', logoutHandler)
    .post('/signup', [Exist_User_Checking, validatePasswordStrength], Signup_Handler)
    .post('/refresh-token', refreshToken);

// Nhóm routes quản lý profile
authRouter.route('/profile')
    .get('/:targetUser?', getProfile);

// Nhóm routes quản lý mật khẩu
authRouter.route('/password')
    .post('/forgot', [verified_Is_Email_Valid], forgot_password)
    .post('/reset', [validatePasswordStrength], reset_password);

// Nhóm routes OTP
authRouter.route('/otp')
    .post('/verify', verified_OTP)
    .get('/resend', resendActivationOTP)
    .post('/verify-forgot-password', verified_OTP_forgot_password);

// Nhóm routes bảo mật
authRouter.route('/security')
    .get('/report-compromised', report_compromised_account);

// Server-Sent Events route
authRouter.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    const interval = setInterval(() => {
        const message = { time: new Date().toISOString() };
        res.write(`data: ${JSON.stringify(message)}\n\n`);
    }, 5000);

    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });

    res.on('error', (err) => {
        clearInterval(interval);
        res.end();
    });
});

export default authRouter;