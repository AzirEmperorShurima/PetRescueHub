import { Router } from "express";
import * as messageController from '../Controller/Messaging.controller.js';

const messagingRouter = Router();

messagingRouter.post('/', messageController.sendMessage);

// Lấy danh sách tin nhắn với một user cụ thể
messagingRouter.get('/:receiverId', messageController.getMessages);

// Đánh dấu tin nhắn là đã đọc
messagingRouter.patch('/:messageId/read', messageController.markMessageAsRead);

export default messagingRouter;