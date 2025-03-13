import { Router } from "express";
import { forgot_password, getProfile, loginHandler, logoutHandler, refreshToken, report_compromised_account, reset_password, Signup_Handler, verified_OTP, verified_OTP_forgot_password } from "../Controller/Auth_Controller.js";
import { Exist_User_Checking, Valid_Roles_Certification } from "../Middlewares/Signup_Verified.js";
import { verified_Is_Email_Valid } from "../Middlewares/verified_Email_Valid.js";

const authRouter = Router();

authRouter.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.flushHeaders();
    next();
})
authRouter.get('/', (req, res) => {
    console.log('Received request at /api/auth');
    res.status(200).json({ message: 'Hello, welcome to the authentication API!' });
});
authRouter.post("/signin", loginHandler)

authRouter.get("/refreshCookies", refreshToken)
authRouter.get('/getUserProfile', getProfile)

authRouter.post("/forgotPassword", [verified_Is_Email_Valid], forgot_password)
authRouter.post("/verifiedResetPassword", [verified_Is_Email_Valid], verified_OTP_forgot_password)
authRouter.post("/resetPassword", reset_password)

authRouter.post("/verifiedOTP", verified_OTP)
authRouter.post("/logout", logoutHandler)

authRouter.post("/signup", [Exist_User_Checking, Valid_Roles_Certification], Signup_Handler)
authRouter.use("/report/compromised", report_compromised_account)
authRouter.post('/logout', logoutHandler)

authRouter.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

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