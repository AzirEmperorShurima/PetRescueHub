import { Router } from 'express';
import { checkUserAuth } from '../../Middlewares/userAuthChecker.js';
import Notification from '../../models/NotificationSchema.js'
const privateRoute = Router();

privateRoute.post('/test-notification', checkUserAuth, async (req, res) => {
    try {
        const userId = req.user._id;

        const notification = await Notification.create({
            userId: userId,
            type: 'info',
            title: 'Test Notification',
            message: 'Đây là thông báo test realtime',
            priority: 'high',
            relatedTo: 'test',
            relatedId: 'test-001',
            metadata: {
                testData: 'Dữ liệu test thêm'
            },
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        res.json({
            success: true,
            message: 'Đã tạo thông báo test',
            notification
        });

    } catch (error) {
        console.error('Test notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo thông báo test'
        });
    }
});

export default privateRoute;