import { Router } from "express";
import { momoCallback, momoPaymentService, momo_Get_Transaction_Status } from "../services/PaymentService/MOMO/Momo.payment.service.js";
import { zaloPayCallBack, zaloPayCheckStatusTransaction, zaloPaymentService } from "../services/PaymentService/ZaloPay/Zalo.payment.service.js";
import { VnPayCreatePaymentUrl, VnPayIPN_URL, VnPayReturnURL } from "../services/PaymentService/VnPay/VnPay.payment.service.js";
// import { get_Transaction_Status } from "../services/PaymentService/MOMO/Momo.payment.js";

const userRoute = Router()

userRoute.get('/', (req, res) => {
    res.status(200).json({ message: 'User API is working' })
})

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