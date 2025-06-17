import TransactionHistory from '../../../models/TransactionHistory.js';
import payos from './PayOS.config.js';

export const createPayment = async (req, res) => {
    try {
        const user_id = req.user._id;
        const { package_id, amount, description } = req.body;

        if (!user_id || !amount || !description) {
            return res.status(400).json({ error: 'Thiếu các trường bắt buộc: user_id, amount, description' });
        }

        const orderCode = Number(String(new Date().getTime()).slice(-6));
        const paymentLinkRes = await payos.createPaymentLink({
            orderCode,
            amount,
            description,
            returnUrl: 'https://yourwebsite.com/success',
            cancelUrl: 'https://yourwebsite.com/cancel',
            data: { user_id, package_id: package_id || null }
        });

        await TransactionHistory.create({
            user_id,
            package_id: package_id || null,
            app_trans_id: orderCode,
            amount,
            description,
            payment_method: 'payos',
            status: 'pending',
            created_at: new Date()
        });

        return res.status(200).json({
            success: true,
            paymentUrl: paymentLinkRes.checkoutUrl,
            orderCode
        });
    } catch (error) {
        console.error('Lỗi khi tạo thanh toán:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Tạo thanh toán thất bại'
        });
    }
};

export const handleWebhook = async (req, res) => {
    try {
        const webhookData = req.body;
        const isValid = await payos.verifyPaymentWebhookData(webhookData);

        if (!isValid) {
            return res.status(400).json({ error: 'Chữ ký webhook không hợp lệ' });
        }

        const { data } = webhookData;
        if (!data) {
            return res.status(400).json({ error: 'Dữ liệu webhook không hợp lệ' });
        }
        console.log(data)
        const { orderCode, amount, success, description } = data;
        let newStatus = success ? 'success' : 'failed'

        let transaction = await TransactionHistory.findOne({ app_trans_id: orderCode });

        if (!transaction) {
            transaction = await TransactionHistory.create({
                user_id: data?.data?.user_id,
                package_id: data?.data?.package_id,
                app_trans_id: orderCode,
                amount,
                description,
                payment_method: 'payos',
                status: newStatus,
                created_at: new Date()
            });
        } else {
            transaction.status = newStatus;
            transaction.updated_at = new Date();
            await transaction.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Webhook xử lý thành công',
            data: { orderCode }
        });
    } catch (error) {
        console.error('Lỗi xử lý webhook:', error);
        return res.status(500).json({
            success: false,
            error: 'Xử lý webhook thất bại'
        });
    }
};