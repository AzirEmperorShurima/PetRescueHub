import { StatusCodes } from "http-status-codes";
import ForumPost from "../models/ForumPost.js";
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config.js';

export const createForumPost = async (req, res) => {
    try {
        const { title, content, tags, imgUrl } = req.body;
        const userCookies = req.cookies.token;

        if (!userCookies) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: 'Unauthorized - No token provided' });
        }

        let decodedUsers

        try {
            decodedUsers = jwt.verify(userCookies, SECRET_KEY);
        } catch (err) {
            console.error("Invalid or expired token:", err.message);
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
        }
        const userId = decodedUsers.id;
        console.log(userId)
        // Kiểm tra quyền user
        // const userPermissions = await UserPermissions.findOne({ user: userId });
        // if (!userPermissions) {
        //     return res.status(403).json({ message: "Không tìm thấy quyền của người dùng!" });
        // }
        // if (userPermissions.isBanned) {
        //     return res.status(403).json({ message: "Bạn đã bị cấm hoạt động!" });
        // }
        // if (!userPermissions.canPostForum) {
        //     return res.status(403).json({ message: "Bạn không có quyền đăng bài trên diễn đàn!" });
        // }

        // Kiểm tra forum có tồn tại không

        // Tạo bài viết mới
        const newPost = new ForumPost({
            title,
            content,
            author: userId,
            tags,
            imgUrl,
            postStatus: "open", // Mặc định bài viết ở trạng thái mở
        });

        await newPost.save();

        // Cập nhật số lượng bài đăng trong forum


        res.status(201).json({ message: "Đăng bài thành công!", post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi đăng bài" });
    }
};
