/**
 * 📥 Thêm comment vào bài viết
 * @param {String} postId - ID bài viết
 * @param {String} content - Nội dung comment
 * @param {String} userId - ID người dùng gửi comment
 * @returns {Promise<Object>} - Kết quả tạo comment
 */

import { CommentModel } from "../../models/CommentsSchema.js";
import { ForumPost } from "../../models/PostSchema.js";

export const addCommentService = async (postId, content, userId) => {
    try {
        // Kiểm tra bài viết có tồn tại không
        const post = await ForumPost.findById(postId);
        if (!post) {
            return { success: false, message: 'Bài viết không tồn tại' };
        }

        // Tạo comment mới
        const newComment = new CommentModel({
            content,
            author: userId,
            post: postId,
            postType: 'ForumPost',
        });

        // Lưu comment vào DB
        await newComment.save();
        return { success: true, comment: newComment };

    } catch (error) {
        console.error(error);
        return { success: false, message: 'Lỗi server khi thêm comment' };
    }
};


/**
 * 📥 Thêm reply cho một comment (trả lời comment cha)
 * @param {String} postId - ID bài viết
 * @param {String} content - Nội dung reply
 * @param {String} userId - ID người gửi reply
 * @param {String} parentComment - ID comment cha
 * @returns {Promise<Object>} - Kết quả tạo reply
 */
export const replyCommentService = async (postId, content, userId, parentComment) => {
    try {
        // Kiểm tra bài viết có tồn tại không
        const post = await ForumPost.findById(postId);
        if (!post) {
            return { success: false, message: 'Bài viết không tồn tại' };
        }

        // Kiểm tra comment cha có tồn tại không
        const parent = await CommentModel.findById(parentComment);
        if (!parent) {
            return { success: false, message: 'Comment cha không tồn tại' };
        }

        // Tạo comment mới (reply)
        const newComment = new CommentModel({
            content,
            author: userId,
            post: postId,
            postType: 'ForumPost',
            parentComment,
            depth: 1
        });

        // Lưu reply vào DB
        await newComment.save();

        // Cập nhật comment cha để thêm reply vào
        await CommentModel.findByIdAndUpdate(parentComment, {
            $push: { replies: newComment._id }
        });

        return { success: true, comment: newComment };

    } catch (error) {
        console.error(error);
        return { success: false, message: 'Lỗi server khi thêm reply' };
    }
};

/**
 * 🗑 Xoá comment theo ID
 * @param {String} commentId - ID comment cần xoá
 * @param {String} userId - ID người yêu cầu xoá (kiểm tra quyền)
 * @returns {Promise<Object>} - Kết quả xoá comment
 */
export const deleteCommentService = async (commentId, userId) => {
    try {
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return { success: false, message: 'Comment không tồn tại' };
        }

        if (comment.author.toString() !== userId) {
            return { success: false, message: 'Không có quyền xoá comment này' };
        }

        await comment.remove(); // middleware sẽ tự xoá khỏi replies của parent (nếu có)

        return { success: true, message: 'Xoá comment thành công' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Lỗi server khi xoá comment' };
    }
};

/**
 * 📝 Cập nhật nội dung comment
 * @param {String} commentId - ID comment cần cập nhật
 * @param {String} userId - ID người dùng (kiểm tra quyền)
 * @param {String} content - Nội dung mới
 * @returns {Promise<Object>} - Kết quả cập nhật comment
 */
export const updateCommentService = async (commentId, userId, content) => {
    try {
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return { success: false, message: 'Comment không tồn tại' };
        }

        if (comment.author.toString() !== userId) {
            return { success: false, message: 'Không có quyền chỉnh sửa comment này' };
        }

        comment.content = content.trim();
        await comment.save();

        return { success: true, message: 'Cập nhật comment thành công', comment };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Lỗi server khi cập nhật comment' };
    }
};

/**
 * 📄 Lấy tất cả comment theo post ID
 * @param {String} postId - ID bài viết
 * @returns {Promise<Object>} - Danh sách comment
 */
export const getCommentsByPostIdService = async (postId) => {
    try {
        const comments = await CommentModel.find({ post: postId })
            .populate('author', 'username avatar')
            .populate('replies')
            .sort({ createdAt: 1 }); // hoặc -1 nếu muốn mới nhất trước

        return { success: true, comments };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Lỗi server khi lấy danh sách comment' };
    }
};
