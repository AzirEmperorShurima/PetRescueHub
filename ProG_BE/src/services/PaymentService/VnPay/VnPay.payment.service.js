// Initial: March/ 03/ 2025
import qs from 'qs';
import crypto from 'crypto';
import { VnPay_Config } from './VnPay.payment.config.js';
import dayjs from 'dayjs'
export const VnPayCreatePaymentUrl = async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let ipAddr = req.headers['x-forwarded-for']
        || req.connection.remoteAddress
        || req.socket.remoteAddress
        || req.connection.socket.remoteAddress;

    console.log('ipAddr', ipAddr)
    const tmnCode = VnPay_Config.vnp_TmnCode;
    const secretKey = VnPay_Config.vnp_HashSecret;
    var vnpUrl = VnPay_Config.vnp_Url;
    const returnUrl = VnPay_Config.vnp_ReturnUrl;

    function sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
    const createDate = dayjs().format('YYYYMMDDHHmmss');
    const orderId = dayjs().format('DDHHmmss');

    const amount = req.body.amount || '2000000';
    const bankCode = req.body.bankCode || '';

    const orderInfo = req.body.orderDescription || "PetRescueHub User PREMIUM Payment"
    const orderType = req.body.orderType || 'other';
    const locale = req.body.language || 'vn';

    var currCode = 'VND';
    
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    // var querystring = qs;
    var signData = qs.stringify(vnp_Params, { encode: false });
    // var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
    console.log(vnpUrl)
    res.redirect(vnpUrl)
};

export const VnPayIPN_URL = async (req, res) => {
    try {
        let vnp_Params = { ...req.query };
        const secureHash = vnp_Params['vnp_SecureHash'];

        // Loại bỏ các key không cần thiết trước khi tạo chữ ký
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        // Sắp xếp các key theo thứ tự alphabet
        const sortedParams = Object.keys(vnp_Params)
            .sort()
            .reduce((acc, key) => {
                acc[key] = vnp_Params[key];
                return acc;
            }, {});

        // Lấy secretKey từ config
        const secretKey = config.get('vnp_HashSecret');

        // Tạo chuỗi dữ liệu chữ ký
        const signData = qs.stringify(sortedParams, { encode: false });

        // Tạo chữ ký HMAC SHA512 dùng Buffer.from() thay cho new Buffer()
        const signed = crypto
            .createHmac('sha512', secretKey)
            .update(Buffer.from(signData, 'utf-8'))
            .digest('hex');

        // Kiểm tra checksum
        if (secureHash === signed) {
            // Có thể thực hiện cập nhật trạng thái đơn hàng dựa theo orderId và rspCode
            const orderId = sortedParams['vnp_TxnRef'];
            const rspCode = sortedParams['vnp_ResponseCode'];
            // Cập nhật đơn hàng, nếu cần xử lý thêm

            res.status(200).json({ RspCode: '00', Message: 'success' });
        } else {
            res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
        }
    } catch (error) {
        console.error('Error processing VNPAY IPN:', error);
        res.status(500).json({ RspCode: '99', Message: 'Internal server error' });
    }
};


export const VnPayReturnURL = async (req, res) => {
    try {

        let vnp_Params = { ...req.query };
        const secureHash = vnp_Params['vnp_SecureHash'];

        // Loại bỏ các thông tin không cần thiết trước khi tạo chữ ký
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        // Sắp xếp object theo thứ tự key alphabet
        const sortedParams = Object.keys(vnp_Params)
            .sort()
            .reduce((acc, key) => {
                acc[key] = vnp_Params[key];
                return acc;
            }, {});

        // Lấy thông tin cấu hình từ config
        const secretKey = config.get('vnp_HashSecret');

        // Tạo dữ liệu chữ ký
        const signData = qs.stringify(sortedParams, { encode: false });

        // Tạo chữ ký HMAC SHA512
        const signed = crypto
            .createHmac('sha512', secretKey)
            .update(Buffer.from(signData, 'utf-8'))
            .digest('hex');

        // Kiểm tra chữ ký hợp lệ
        const responseCode = secureHash === signed ? sortedParams['vnp_ResponseCode'] : '97';

        // Render trang kết quả
        res.render('success', { code: responseCode });
    } catch (error) {
        console.error('Error processing VNPAY return:', error);
        res.render('success', { code: '99' }); // Mã lỗi 99: lỗi hệ thống
    }
};