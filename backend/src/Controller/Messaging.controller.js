import Message from '../models/Message.js';
import user from '../models/user.js';


// Gửi tin nhắn
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { receiver, content, type = 'text' } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!receiver || !content) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu receiver hoặc content'
            });
        }

        // Kiểm tra user nhận có tồn tại
        const receiverUser = await user.findById(receiver);
        if (!receiverUser) {
            return res.status(404).json({
                success: false,
                message: 'Người nhận không tồn tại'
            });
        }

        // Không cho phép gửi tin nhắn cho chính mình
        if (senderId.toString() === receiver.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Không thể gửi tin nhắn cho chính mình'
            });
        }

        // Kiểm tra type hợp lệ
        if (!['text', 'call-offer', 'call-answer', 'ice-candidate'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Loại tin nhắn không hợp lệ'
            });
        }

        // Tạo tin nhắn mới
        const message = new Message({
            sender: senderId,
            receiver,
            content,
            type,
            isRead: false
        });

        await message.save();

        // Populate thông tin sender và receiver
        await message.populate([
            { path: 'sender', select: 'fullname username avatar' },
            { path: 'receiver', select: 'fullname username avatar' }
        ]);

        return res.status(201).json({
            success: true,
            message: 'Gửi tin nhắn thành công',
            data: message
        });

    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
}

// Lấy danh sách tin nhắn
export const getMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const { receiverId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const receiverUser = await user.findById(receiverId);
        if (!receiverUser) {
            return res.status(404).json({
                success: false,
                message: 'Người nhận không tồn tại'
            });
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const query = {
            $or: [
                { sender: userId, receiver: receiverId },
                { sender: receiverId, receiver: userId }
            ]
        };

        const totalMessages = await Message.countDocuments(query);

        // Lấy danh sách tin nhắn
        const messages = await Message.find(query)
            .populate('sender', 'fullname username avatar')
            .populate('receiver', 'fullname username avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách tin nhắn thành công',
            data: {
                messages,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(totalMessages / limitNum),
                    totalItems: totalMessages,
                    limit: limitNum
                }
            }
        });

    } catch (error) {
        console.error('Lỗi khi lấy danh sách tin nhắn:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
}

export const markMessageAsRead =  async (req, res) => {
    try {
        const userId = req.user._id;
        const { messageId } = req.params;

        // Tìm tin nhắn
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Tin nhắn không tồn tại'
            });
        }

        if (message.receiver.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Chỉ người nhận mới có thể đánh dấu tin nhắn là đã đọc'
            });
        }
        message.isRead = true;
        await message.save();

        await message.populate([
            { path: 'sender', select: 'fullname username avatar' },
            { path: 'receiver', select: 'fullname username avatar' }
        ]);

        return res.status(200).json({
            success: true,
            message: 'Đánh dấu tin nhắn là đã đọc thành công',
            data: message
        });

    } catch (error) {
        console.error('Lỗi khi đánh dấu tin nhắn là đã đọc:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
}