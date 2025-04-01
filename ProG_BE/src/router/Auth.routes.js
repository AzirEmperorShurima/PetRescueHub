import { Router } from "express";
import { forgot_password, getProfile, loginHandler, logoutHandler, refreshToken, report_compromised_account, reset_password, Signup_Handler, verified_OTP, verified_OTP_forgot_password } from "../Controller/Auth.Controller.js";
import { Exist_User_Checking, Valid_Roles_Certification } from "../Middlewares/Signup_Verified.js";
import { verified_Is_Email_Valid } from "../Middlewares/verified_Email_Valid.js";

const authRouter = Router();

authRouter.use((req, res, next) => {
    res.set({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
    });
    // res.flushHeaders();
    next();
})

// Welcome route
authRouter.get('/', (req, res) => {
    console.log('Received request at /api/auth');
    res.status(200).json({
        message: 'Welcome to Authentication API',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// Authentication routes
authRouter.post('/access/login', loginHandler);
authRouter.post('/logout', logoutHandler);
authRouter.post('/sign/signup', [Exist_User_Checking, Valid_Roles_Certification], Signup_Handler);
authRouter.post('/re-sign/refresh-token', refreshToken);

// User profile route
authRouter.get('get/profile', getProfile);

// Password Recovery
authRouter.post('/password/forgot-password', [verified_Is_Email_Valid], forgot_password);
authRouter.post('/password/reset-password', reset_password);
// Token & OTP
authRouter.post('/sign/verify-otp', verified_OTP);
authRouter.post('/password/verify-otp-forgot-password', [verified_Is_Email_Valid], verified_OTP_forgot_password);

// Security routes
authRouter.post('/protect/report-compromised', report_compromised_account);

authRouter.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // res.setHeader('Access-Control-Allow-Origin', '*');

    // Gửi kết nối thành công
    res.write('data: Connection established\n\n');

    // Gửi dữ liệu định kỳ ( mỗi 5 giây)
    const interval = setInterval(() => {
        const message = { time: new Date().toISOString() };
        res.write(`data: ${JSON.stringify(message)}\n\n`);
    }, 5000);

    req.on('close', () => {
        clearInterval(interval);
        console.log('SSE client disconnected');
    });
});



export default authRouter;