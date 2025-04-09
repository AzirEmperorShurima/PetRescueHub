/**
 * 📥 Thêm comment vào bài viết
 * @param {String} postId - ID bài viết
 * @param {String} content - Nội dung comment
 * @param {String} userId - ID người dùng gửi comment
 * @returns {Promise<Object>} - Kết quả tạo comment
 */

import { CommentModel } from "../../models/CommentsSchema.js";
import { ForumPost, PostModel } from "../../models/PostSchema.js";
import mongoose from "mongoose";
export const addCommentService = async (postId, content, userId) => {
    try {
        // Kiểm tra bài viết có tồn tại không
        const post = await PostModel.findById(postId);
        if (!post) {
            return { success: false, message: 'Bài viết không tồn tại' };
        }

        // Tạo comment mới
        const newComment = new CommentModel({
            content,
            author: userId,
            post: postId,
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
 * 📄 Lấy danh sách comment theo post ID với phân trang
 * @param {Object} options - Tùy chọn
 * @param {String} options.postId - ID bài viết
 * @param {Number} options.page - Trang hiện tại (mặc định: 1)
 * @param {Number} options.limit - Số comment mỗi trang (mặc định: 10)
 * @returns {Promise<Object>} - Danh sách comment và thông tin phân trang
 */
// export const getCommentsByPostIdService = async (postId) => {
//     try {
//         const comments = await CommentModel.find({ post: postId })
//             .populate('author', 'username avatar')
//             .populate('replies')
//             .sort({ createdAt: 1 })
//             .lean()

//         return { success: true, data: comments };
//     } catch (error) {
//         console.error(error);
//         return { success: false, message: 'Lỗi server khi lấy danh sách comment' };
//     }
// };

export const getCommentsByPostIdService = async ({ postId, page = 1, limit = 10 }) => {
    try {
        // Pipeline aggregation để lấy comment cấp 1 và tối ưu hóa
        const commentsPipeline = [
            // Lọc comment thuộc bài post và là comment cấp 1 (không có parent)
            { $match: { post: new mongoose.Types.ObjectId(postId), parentComment: null } },
            // Sắp xếp theo createdAt (mới nhất trước hoặc cũ nhất trước tùy yêu cầu)
            { $sort: { createdAt: -1 } },
            // Phân trang
            { $skip: (page - 1) * limit },
            { $limit: limit },
            // Lookup thông tin author
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                    pipeline: [
                        { $project: { username: 1, avatar: 1 } },
                    ],
                },
            },
            { $unwind: '$author' },
            // Đếm số lượng replies cho mỗi comment
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'parentComment',
                    as: 'replies',
                    pipeline: [
                        { $project: { _id: 1 } }, // Chỉ lấy ID để đếm
                    ],
                },
            },
            // Dự án dữ liệu trả về
            {
                $project: {
                    content: 1,
                    author: {
                        id: '$author._id',
                        username: '$author.username',
                        avatar: { $ifNull: ['$author.avatar', 'default-avatar-url'] },
                    },
                    post: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    replyCount: { $size: '$replies' }, // Số lượng reply
                },
            },
        ];

        // Thực thi aggregation và đếm tổng số comment cấp 1
        const [comments, totalRootComments] = await Promise.all([
            CommentModel.aggregate(commentsPipeline).exec(),
            CommentModel.countDocuments({
                post: new mongoose.Types.ObjectId(postId),
                parentComment: null,
            }),
        ]);

        const totalPages = Math.ceil(totalRootComments / limit);

        return {
            success: true,
            data: comments,
            pagination: {
                currentPage: page,
                totalPages,
                totalRootComments,
                limit,
                hasNext: page < totalPages && comments.length === limit,
                hasPrev: page > 1,
            },
        };
    } catch (error) {
        console.error('Error in getCommentsByPostIdService:', error);
        return { success: false, message: 'Lỗi server khi lấy danh sách comment' };
    }
};
/**
 * 📄 Lấy danh sách reply comments của một comment cha cụ thể
 * @param {Object} options - Tùy chọn
 * @param {String} options.parentCommentId - ID của comment cha
 * @param {Number} options.page - Trang hiện tại (mặc định: 1)
 * @param {Number} options.limit - Số reply mỗi trang (mặc định: 10)
 * @returns {Promise<Object>} - Danh sách reply comments và thông tin phân trang
 */
export const getRepliesByParentService = async ({ parentCommentId, page = 1, limit = 10 }) => {
    try {
        const repliesPipeline = [
            {
                $match: {
                    parentComment: new mongoose.Types.ObjectId(parentCommentId),
                },
            },
            { $sort: { createdAt: -1 } },
            // Phân trang
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                    pipeline: [
                        { $project: { username: 1, avatar: 1 } },
                    ],
                },
            },
            { $unwind: '$author' },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'parentComment',
                    as: 'replies',
                    pipeline: [
                        { $project: { _id: 1 } }, 
                    ],
                },
            },
            {
                $project: {
                    content: 1,
                    author: {
                        id: '$author._id',
                        username: '$author.username',
                        avatar: { $ifNull: ['$author.avatar', 'default-avatar-url'] },
                    },
                    post: 1,
                    parentComment: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    replyCount: { $size: '$replies' },
                },
            },
        ];
        const [replies, totalReplies] = await Promise.all([
            CommentModel.aggregate(repliesPipeline).exec(),
            CommentModel.countDocuments({
                parentComment: new mongoose.Types.ObjectId(parentCommentId),
            }),
        ]);

        const totalPages = Math.ceil(totalReplies / limit);

        return {
            success: true,
            data: replies,
            pagination: {
                currentPage: page,
                totalPages,
                totalReplies,
                limit,
                hasNext: page < totalPages && replies.length === limit,
                hasPrev: page > 1,
            },
        };
    } catch (error) {
        console.error('Error in getRepliesByParentService:', error);
        return { success: false, message: 'Lỗi server khi lấy danh sách reply comments' };
    }
};