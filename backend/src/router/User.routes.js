import { Router } from "express";
import { momoCallback, momoPaymentService, momo_Get_Transaction_Status } from "../services/PaymentService/MOMO/Momo.payment.service.js";
import { zaloPayCallBack, zaloPayCheckStatusTransaction, zaloPaymentService } from "../services/PaymentService/ZaloPay/Zalo.payment.service.js";
import { VnPayCreatePaymentUrl, VnPayIPN_URL, VnPayReturnURL } from "../services/PaymentService/VnPay/VnPay.payment.service.js";
import { updateUserProfile } from "../Controller/User.Controller.js";
// import { avatarUploadMiddleware } from "../Middlewares/CloudinaryUploader.js";
import { checkUserAuth } from "../Middlewares/userAuthChecker.js";
import { avatarUploadMiddleware } from "../Middlewares/CloudinaryUploader.Middlware.js";
// import { get_Transaction_Status } from "../services/PaymentService/MOMO/Momo.payment.js";
import { verifyAccessTokenMiddleware, verifyRefreshTokenMiddleware } from "../utils/auth/authUtils.js";

const userRoute = Router()
userRoute.use(checkUserAuth)
userRoute.get('/', (req, res) => {
    res.status(200).json({ message: 'User API is working' })
})
userRoute.get("/v1", async (req, res) => {
    console.log('Received request at /api/user/v1');
    res.status(200).json({
        message: 'Welcome to User API Version 1.0',
        ip: req.ip,
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

userRoute.get("/v2", async (req, res) => {
    console.log('Received request at /api/user/v2');
    res.status(200).json({
        message: 'Welcome to User API Version 2.0',
        ip: req.ip,
        status: 'success',
        timestamp: new Date().toISOString()
    });
});
userRoute.use(verifyAccessTokenMiddleware, verifyRefreshTokenMiddleware)

userRoute.put('/v1/user/own/profile/update', [avatarUploadMiddleware("user_avatar")], updateUserProfile)

// Momo Payment Gate for PREMIUM USER
userRoute.post('/user/payments/momo/transactions/create', momoPaymentService);
userRoute.post('/user/payments/momo/callback', momoCallback);
userRoute.post('/user/payments/momo/transactions/status', momo_Get_Transaction_Status);

// ZaloPay Payment Gate for PREMIUM USER
userRoute.post('/user/payments/zalopay/transactions/create', zaloPaymentService);
userRoute.post('/user/payments/zalopay/callback', zaloPayCallBack);
userRoute.post('/user/payments/zalopay/transactions/status', zaloPayCheckStatusTransaction);

// VNPay Payment Gate for PREMIUM USER
userRoute.post('/user/payments/vnpay/transactions/create', VnPayCreatePaymentUrl);
userRoute.post('/user/payments/vnpay/ipn-url', VnPayIPN_URL);
userRoute.post('/user/payments/vnpay/transactions/refund', VnPayReturnURL);


export default userRoute