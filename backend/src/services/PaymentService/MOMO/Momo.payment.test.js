import axios from 'axios';
import crypto from 'crypto';
import {
    accessKey,
    secretKey,
    ipnUrl,
    MOMO_API,
    orderInfo,
    partnerCode,
    redirectUrl,
    requestType
} from '../../../../config.js';

// Hàm tạo chữ ký HMAC-SHA256
const generateSignature = (params, key) => {
    const rawSignature = Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');

    return crypto.createHmac('sha256', key)
        .update(rawSignature)
        .digest('hex');
};

// Xử lý thanh toán với MoMo
export const momoPaymentService = async (req, res) => {
    try {
        const { amount } = req.body;
        const orderId = `${partnerCode}${Date.now()}`;
        const requestId = orderId;

        const params = {
            accessKey,
            amount,
            extraData: '',
            ipnUrl,
            orderId,
            orderInfo,
            partnerCode,
            redirectUrl,
            requestId,
            requestType,
        };

        const signature = generateSignature(params, secretKey);

        const requestBody = {
            ...params,
            partnerName: "Test",
            storeId: "MomoTestStore",
            lang: 'vi',
            autoCapture: true,
            orderGroupId: '',
            signature
        };

        console.log("🚀 Sending MoMo Payment Request:", requestBody);

        const { data } = await axios.post(MOMO_API, requestBody, {
            headers: { 'Content-Type': 'application/json' }
        });

        return res.status(200).json(data);
    } catch (error) {
        console.error("❌ MoMo Payment Error:", error.message);
        return res.status(500).json({ statusCode: 500, message: error.message });
    }
};

// Xử lý callback từ MoMo
export const momoCallback = (req, res) => {
    console.log("🔄 MoMo Callback Received:", req.body);
    return res.status(204).json(req.body);
};

// Kiểm tra trạng thái giao dịch
export const getTransactionStatus = async (req, res) => {
    try {
        const { orderId } = req.body;

        const params = {
            accessKey,
            orderId,
            partnerCode: 'MOMO',
            requestId: orderId
        };

        const signature = generateSignature(params, secretKey);

        const requestBody = {
            ...params,
            signature,
            lang: 'vi'
        };

        console.log("🔍 Checking Transaction Status:", requestBody);

        const { data } = await axios.post(MOMO_API, requestBody, {
            headers: { 'Content-Type': 'application/json' }
        });

        return res.status(200).json(data);
    } catch (error) {
        console.error("❌ Transaction Status Error:", error.message);
        return res.status(500).json({ statusCode: 500, message: error.message });
    }
};
