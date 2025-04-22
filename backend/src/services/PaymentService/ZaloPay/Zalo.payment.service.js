import axios from 'axios';
import CryptoJS from 'crypto-js';
// import moment from 'moment';
import { config } from './Zalo.payment.config.js';
import dayjs from 'dayjs'

/**
 * methed: POST
 * Sandbox	POST	https://sb-openapi.zalopay.vn/v2/create
 * Real	POST	https://openapi.zalopay.vn/v2/create
 * description: tạo đơn hàng, thanh toán
 */
/**
 * Xử lý thanh toán với phương thức được chọn (hiện tại hỗ trợ ZaloPay)
 * @param {string} method - Phương thức thanh toán (zalopay, momo, vnpay,...)
 * @param {number} amount - Số tiền cần thanh toán
 * @returns {Promise<object>}
 */
export const zaloPaymentService = async (req, res) => {
    const embed_data = {
        //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
        redirecturl: 'https://google.com',
    };

    const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
        app_id: config.app_id,
        app_trans_id: `${dayjs().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: 'PetRescueHub',
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: 50000,
        callback_url: 'https://b074-1-53-37-194.ngrok-free.app/callback',
        description: `PetRescueHub - Payment for buy User Premium transaction #${transID}`,
        bank_code: '',
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });

        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error);
    }
};

/**
 * method: POST
 * description: callback để Zalopay Server call đến khi thanh toán thành công.
 * Khi và chỉ khi ZaloPay đã thu tiền khách hàng thành công thì mới gọi API này để thông báo kết quả.
 */


export const zaloPayCallBack = (req, res) => {
    let result = {};
    const { data: dataStr, mac: reqMac } = req.body;

    try {
        // let dataStr = req.body.data;
        // let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log('mac =', mac);

        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // callback không hợp lệ
            result.return_code = -1;
            result.return_message = 'MAC không hợp lệ';
        } else {
            // thanh toán thành công
            // merchant cập nhật trạng thái cho đơn hàng ở đây
            const dataJson = JSON.parse(dataStr);
            console.log(`✅ Đơn hàng ${dataJson['app_trans_id']} đã được thanh toán thành công`);

            result.return_code = 1;
            result.return_message = 'Thành công';

        }
    } catch (ex) {
        // console.log('lỗi:::' + ex.message);
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
};

/**
 * method: POST
 * Sandbox	POST	https://sb-openapi.zalopay.vn/v2/query
 * Real	POST	https://openapi.zalopay.vn/v2/query
 * description:
 * Khi user thanh toán thành công,
 * ZaloPay sẽ gọi callback (notify) tới merchant để merchant cập nhật trạng thái
 * đơn hàng Thành Công trên hệ thống. Trong thực tế callback có thể bị miss do lỗi Network timeout,
 * Merchant Service Unavailable/Internal Error...
 * nên Merchant cần hiện thực việc chủ động gọi API truy vấn trạng thái đơn hàng.
 */
/**
 * Kiểm tra trạng thái đơn hàng
 * @param {string} app_trans_id - Mã giao dịch
 * @returns {Promise<object>}
 */
export const zaloPayCheckStatusTransaction = async (req, res) => {
    const { app_trans_id } = req.body;

    let postData = {
        app_id: config.app_id,
        app_trans_id, // Input your app_trans_id
    };

    let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
        method: 'post',
        url: 'https://sb-openapi.zalopay.vn/v2/query',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(postData),
    };

    try {
        const result = await axios(postConfig);
        return res.status(200).json(result.data);
        /**
         * kết quả mẫu
          {
            "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
            "return_message": "",
            "sub_return_code": 1,
            "sub_return_message": "",
            "is_processing": false,
            "amount": 50000,
            "zp_trans_id": 240331000000175,
            "server_time": 1711857138483,
            "discount_amount": 0
          }
        */
    } catch (error) {
        throw new Error(`Lỗi kiểm tra đơn hàng: ${error.message}`);
    }
};
