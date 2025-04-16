/**
 * 📥 Thêm comment vào bài viết
 * @param {String} postId - ID bài viết
 * @param {String} content - Nội dung comment
 * @param {String} userId - ID người dùng gửi comment
 * @returns {Promise<Object>} - Kết quả tạo comment
 */

import { CommentModel } from "../../models/CommentsSchema.js";
import { PostModel } from "../../models/PostSchema.js";
import mongoose from "mongoose";
import Reaction from "../../models/ReactionSchema.js";
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
        const post = await PostModel.findById(postId);
        if (!post) {
            return { success: false, message: 'Bài viết không tồn tại' };
        }
        const parent = await CommentModel.findById(parentComment);
        if (!parent) {
            return { success: false, message: 'Comment cha không tồn tại' };
        }
        const newComment = new CommentModel({
            content,
            author: userId,
            post: postId,
            parentComment,
        });
        await newComment.save();
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
        // Chỉ lấy những field cần thiết
        const comment = await CommentModel.findById(commentId)
            .select('author isDeleted post')
            .exec();

        if (!comment) {
            return { success: false, message: 'Comment không tồn tại' };
        }

        if (comment.author.toString() !== userId) {
            return { success: false, message: 'Không có quyền xoá comment này' };
        }

        if (comment.isDeleted) {
            return { success: false, message: 'Comment đã bị xóa trước đó' };
        }

        // Thực hiện song song
        const [updateResult, updatePost, deleteReactions] = await Promise.all([
            CommentModel.updateOne(
                { _id: commentId },
                { isDeleted: true, deletedAt: new Date() }
            ),
            PostModel.findByIdAndUpdate(
                comment.post,
                { $inc: { commentCount: -1 } },
                { new: true }
            ),
            Reaction.deleteMany({
                targetType: 'Comment',
                targetId: commentId,
            }),
        ]);

        // Check riêng từng lỗi để báo lỗi rõ ràng hơn
        if (updateResult.modifiedCount === 0) {
            return { success: false, message: 'Không thể đánh dấu xóa comment' };
        }

        if (!updatePost) {
            return { success: false, message: 'Không thể cập nhật số lượng comment trong bài viết' };
        }

        return {
            success: true,
            message: 'Xóa comment thành công',
            data: {
                deletedCommentId: commentId,
                deletedReactionsCount: deleteReactions.deletedCount,
            },
        };
    } catch (error) {
        console.error('[deleteCommentService]', error);
        return {
            success: false,
            message: 'Lỗi server khi xoá comment',
        };
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
export const getCommentsByPostIdService = async ({ postId, page = 1, limit = 10 }) => {
    try {
        const commentsPipeline = [
            {
                $match: {
                    post: new mongoose.Types.ObjectId(postId),
                    parentComment: null,
                    isDeleted: false, // Lọc bỏ comment đã xóa
                },
            },
            { $sort: { createdAt: -1 } },
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
                        { $match: { isDeleted: false } }, // Chỉ đếm replies chưa xóa
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
                    createdAt: 1,
                    updatedAt: 1,
                    replyCount: { $size: '$replies' },
                    reactions: 1,
                    isDeleted: 1,
                },
            },
        ];

        const [comments, totalRootComments] = await Promise.all([
            CommentModel.aggregate(commentsPipeline).exec(),
            CommentModel.countDocuments({
                post: new mongoose.Types.ObjectId(postId),
                parentComment: null,
                isDeleted: false,
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
        console.error('Error in getCommentsByPostIdService:', {
            postId,
            page,
            limit,
            error: error.message,
        });
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
                    isDeleted: false, // Lọc bỏ reply đã xóa
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                    pipeline: [{ $project: { username: 1, avatar: 1 } }],
                },
            },
            { $unwind: '$author' },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'parentComment',
                    foreignField: '_id',
                    as: 'parentInfo',
                    pipeline: [
                        { $project: { content: 1, isDeleted: 1, author: 1 } },
                    ],
                },
            },
            { $unwind: '$parentInfo' },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'parentComment',
                    as: 'replies',
                    pipeline: [
                        { $match: { isDeleted: false } },
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
                    reactions: 1, // Thêm thông tin reactions
                    parentDeleted: '$parentInfo.isDeleted',
                    parentContent: {
                        $cond: {
                            if: '$parentInfo.isDeleted',
                            then: '[Đã bị xóa]',
                            else: '$parentInfo.content',
                        },
                    },
                },
            },
        ];

        const [replies, totalReplies] = await Promise.all([
            CommentModel.aggregate(repliesPipeline).exec(),
            CommentModel.countDocuments({
                parentComment: new mongoose.Types.ObjectId(parentCommentId),
                isDeleted: false,
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
        console.error('Error in getRepliesByParentService:', {
            parentCommentId,
            page,
            limit,
            error: error.message,
        });
        return { success: false, message: 'Lỗi server khi lấy danh sách reply comments' };
    }
};