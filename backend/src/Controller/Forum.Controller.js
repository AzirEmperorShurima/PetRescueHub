import { StatusCodes } from "http-status-codes";
import { ForumPost, PostModel } from "../models/PostSchema.js";
import * as forumService from "../services/Forum/Forum.service.js";
import * as commentService from "../services/Comments/Comments.service.js"
import * as reactionService from "../services/Reaction/Reaction.service.js";
import { CommentModel } from "../models/CommentsSchema.js";
import Reaction from "../models/ReactionSchema.js";
import mongoose from "mongoose";
import { moderationQueue } from "../Jobs/ContentModeratorJob.js";

export const getForumPosts = async (req, res) => {
    try {
        const userId = req.user._id
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        const requestOptions = {
            limit: parseInt(req.query.limit) || 10,
            cursor: req.query.cursor || null,
            search: req.query.search || "",
            tag: req.query.tag || "",
            postType: req.query.postType || "",
            excludeIds: req.query.excludeIds ? JSON.parse(req.query.excludeIds) : [],
            userId
        };

        const result = await forumService.getRefreshedListForumPosts(requestOptions);

        if (!result.success) {
            return res.status(500).json({ success: false, message: result.message });
        }

        return res.status(200).json({
            success: true,
            data: result.data,
            pagination: {
                totalPosts: result.totalPosts,
                limit: requestOptions.limit,
                nextCursor: result.nextCursor,
                hasNext: result.hasNext
            }
        });
    } catch (error) {
        console.error("Error in getRefreshedForumPosts:", error);
        return res.status(500).json({ success: false, message: "Lỗi server khi làm mới danh sách bài viết" });
    }
};


export const getPostById = async (req, res) => {
    const userId = req.user._id
    if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
    }
    const result = await forumService.getPostById(req.params.Post_id);

    if (result.success) {
        return res.status(StatusCodes.OK).json(result.data);
    } else {
        return res.status(404).json({ message: result.message });
    }
};

export const updateForumPost = async (req, res) => {
    try {
        const userId = req.user._id
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        const { title, content, tags, postStatus } = req.body;
        const imgUrl = req.uploadedImageUrls || [];
        const postFound = await ForumPost.findById(req.params.post_id);
        if (!postFound) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Bài viết không tồn tại" });
        }
        if (postFound.author.toString() !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Không có quyền chỉnh sửa bài viết này" });
        }
        if (!title || !content) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Tiêu đề và nội dung không được để trống" });
        }

        const updateData = {};
        let contentChanged = false;

        if (title && title.trim() !== postFound.title) {
            updateData.title = title.trim();
            contentChanged = true;
        }
        if (content && content.trim() !== postFound.content) {
            updateData.content = content.trim();
            contentChanged = true;
        }

        const inputTags = Array.isArray(tags) ? tags : (tags ? [tags] : []);
        const sortedInputTags = [...inputTags].sort();
        const sortedPostTags = [...postFound.tags].sort();
        if (tags && JSON.stringify(sortedInputTags) !== JSON.stringify(sortedPostTags)) {
            updateData.tags = inputTags;
        }

        // Xử lý imgUrl
        const inputImgUrl = Array.isArray(imgUrl) ? imgUrl : (imgUrl ? [imgUrl] : []);
        const sortedInputImgUrl = [...inputImgUrl].sort();
        const sortedPostImgUrl = [...postFound.imgUrl].sort();
        if (imgUrl && JSON.stringify(sortedInputImgUrl) !== JSON.stringify(sortedPostImgUrl)) {
            updateData.imgUrl = inputImgUrl;
        }

        if (postStatus && postStatus !== postFound.postStatus) {
            updateData.postStatus = postStatus;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Không có thay đổi nào được thực hiện",
                post: postFound
            });
        }

        if (contentChanged) {
            updateData.postStatus = 'pending';
            updateData.violate_tags = [];
        }

        const result = await forumService.updatePost(
            req.params.post_id,
            userId,
            updateData
        );

        if (result.success) {
            if (contentChanged) {
                await moderationQueue.add('moderatePost', {
                    postId: req.params.post_id,
                    title: updateData.title || postFound.title,
                    content: updateData.content || postFound.content,
                    postType: postFound.__t || 'ForumPost',
                    userId,
                }, {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 1000 }
                });

                return res.status(StatusCodes.OK).json({
                    success: true,
                    message: "Cập nhật bài viết thành công, đang chờ kiểm duyệt!",
                    post: result.post
                });
            }

            return res.status(StatusCodes.OK).json(result);
        }
        return res.status(403).json({ message: result.message });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Lỗi server khi cập nhật bài viết" });
    }
};

export const createNewForumPost = async (req, res) => {
    try {
        const {
            title, content, tags, postType,
            questionDetails, lostPetInfo,
            eventStartDate, eventEndDate,
            eventLongitude, eventLatitude, eventLocation
        } = req.body;

        const imgUrl = req.uploadedImageUrls || [];
        const userId = req.user?._id;
        console.log("Data resolving:", {
            title, content, tags, postType,
            questionDetails, lostPetInfo,
            eventStartDate, eventEndDate,
            eventLongitude, eventLatitude, eventLocation,
            imgUrl, userId
        });

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để đăng bài" });
        }

        if (!title || !content || !postType) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Thiếu thông tin bắt buộc" });
        }

        const baseData = {
            title: title.trim(),
            content: content.trim(),
            tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
            imgUrl: Array.isArray(imgUrl) ? imgUrl : [],
            author: new mongoose.Types.ObjectId(String(userId)),
            postStatus: 'pending',
            violate_tags: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const postTypeData = {
            'Question': { questionDetails },
            'FindLostPetPost': { lostPetInfo },
            'EventPost': {
                ...(eventStartDate && { eventStartDate: new Date(eventStartDate) }),
                ...(eventEndDate && { eventEndDate: new Date(eventEndDate) }),
                ...(eventLongitude && { eventLongitude: Number(eventLongitude) }),
                ...(eventLatitude && { eventLatitude: Number(eventLatitude) }),
                ...(eventLocation && { eventLocation }),
                approvalStatus: 'pending',
            }
        };
        const fullPostData = { ...baseData, ...(postTypeData[postType] || {}) };


        const PostSubModel = PostModel.discriminators[postType] || PostModel;
        const newPost = new PostSubModel(fullPostData);
        await newPost.save();

        await moderationQueue.add('moderatePost', {
            postId: newPost._id.toString(),
            title: title.trim(),
            content: content.trim(),
            postType,
            userId,
        }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 }
        });

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Đăng bài thành công, đang chờ kiểm duyệt!",
            post: newPost
        });

    } catch (error) {
        console.error("❌ Lỗi controller:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Lỗi server khi đăng bài",
            error: error.message
        });
    }
};



export const addComment = async (req, res) => {
    try {
        const { postId, content } = req.body;
        const userId = req.user._id
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        // Kiểm tra bài viết có tồn tại không
        const post = await PostModel.findById(postId);
        if (!post) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bài viết không tồn tại" });
        if (!content) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Nội dung không được để trống" });
        }
        const newComment = await commentService.addCommentService(postId, content, userId);
        if (!newComment.success) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: newComment.message });
        }
        res.status(StatusCodes.CREATED).json({ message: "Đã thêm comment", comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};

export const replyComment = async (req, res) => {
    try {
        const { postId, content, parentComment } = req.body;
        const userId = req.user._id
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        const parent_commment = await CommentModel.findById(parentComment);
        if (!parent_commment) return res.status(StatusCodes.NOT_FOUND).json({ message: "Parent Comment Does Not Exist" });

        // Kiểm tra bài viết có tồn tại không
        const post = await PostModel.findById(postId);
        if (!post) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bài viết không tồn tại" });
        if (!content) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Nội dung không được để trống" });
        }
        const newRepliesComment = await commentService.replyCommentService(postId, content, userId, parentComment);
        if (!newRepliesComment.success) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: newRepliesComment.message });
        }
        res.status(StatusCodes.CREATED).json({ message: "Đã thêm comment", comment: newRepliesComment });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });

    }
}

// lấy danh sách comment(đã phân trang) của 1 bài post 
export const getCommentsByPost = async (req, res) => {
    try {
        const userId = req.user._id
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        const { postId } = req.params;
        const { page = 1, limit = 10 } = req.query; // Thêm phân trang từ query

        const result = await commentService.getCommentsByPostIdService({
            postId,
            page: parseInt(page),
            limit: parseInt(limit),
        });

        if (!result.success) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: result.message,
            });
        }

        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: result.data,
            pagination: result.pagination,
            metadata: {
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Error in getCommentsByPost:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Lỗi server khi lấy danh sách comment',
        });
    }
};

// Lấy danh sách reply comments theo commentId của comment cha
export const getRepliesByParent = async (req, res) => {
    const userId = req.user._id
    if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
    }
    try {
        const { commentId } = req.params; // Lấy commentId thay vì postId
        const { page = 1, limit = 10 } = req.query;

        const result = await commentService.getRepliesByParentService({
            parentCommentId: commentId,
            page: parseInt(page),
            limit: parseInt(limit),
        });

        if (!result || !result.success) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: result?.message || "Lỗi server khi lấy danh sách reply comments",
            });
        }

        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: result.data,
            pagination: result.pagination,
            metadata: {
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Error in getRepliesByParent:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Lỗi server khi lấy danh sách reply comments',
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        const comment = await CommentModel.findById(commentId);
        if (!comment) return res.status(StatusCodes.NOT_FOUND).json({ message: "Comment does not exists" });

        if (comment.author.toString() !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Không có quyền xóa comment này" });
        }
        const deleteComment = await commentService.deleteCommentService(commentId, userId);
        if (!deleteComment.success) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: deleteComment.message });
        }
        res.status(StatusCodes.OK).json({ message: "Đã xóa comment" });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};


// 📌 Cập nhật nội dung comment (chỉ tác giả mới sửa được)
export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user._id
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        if (!content) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Nội dung không được để trống" });
        }

        const comment = await CommentModel.findById(commentId);
        if (!comment) return res.status(StatusCodes.NOT_FOUND).json({ message: "Comment không tồn tại" });

        if (comment.author.toString() !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Không có quyền chỉnh sửa comment này" });
        }
        const updatedComment = await commentService.updateCommentService(commentId, userId, content);
        if (!updatedComment.success) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: updatedComment.message });
        }
        res.status(StatusCodes.OK).json({ message: "Đã cập nhật comment", comment: updatedComment.comment });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};

export const handlerReaction = async (req, res) => {
    try {
        const { targetId, reactionType, targetType } = req.body;
        const userId = req.user._id;

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        if (!reactionType) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Loại reaction không được để trống' });
        }

        if (!targetId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Target ID không được để trống' });
        }

        if (!targetType) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Target Type không được để trống' });
        }

        const validTargetTypes = Object.keys(PostModel.discriminators || {}).concat(['Post', 'Comment']);
        if (!validTargetTypes.includes(targetType)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Target type không hợp lệ, phải là một trong: ${validTargetTypes.join(', ')}` });
        }

        const validReactionTypes = Reaction.schema.paths.reactionType.enumValues;
        if (!validReactionTypes.includes(reactionType)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Loại reaction không hợp lệ, phải là một trong: ${validReactionTypes.join(', ')}` });
        }

        const result = await reactionService.addOrUpdateReaction({ userId, targetType, targetId, reactionType });

        if (!result || !result.success) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: result?.message || "Lỗi trong quá trình xử lý reaction"
            });
        }

        // Trả về response tùy theo action đã thực hiện
        switch (result.action) {
            case 'created':
                return res.status(StatusCodes.CREATED).json({
                    success: true,
                    message: "Đã thêm reaction",
                    reaction: result.reaction,
                    action: 'created'
                });

            case 'updated':
                return res.status(StatusCodes.OK).json({
                    success: true,
                    message: "Đã cập nhật loại reaction",
                    reaction: result.reaction,
                    oldReactionType: result.oldReactionType,
                    action: 'updated'
                });

            case 'removed':
                return res.status(StatusCodes.OK).json({
                    success: true,
                    message: "Đã hủy reaction",
                    reactionType: result.reactionType,
                    action: 'removed'
                });

            default:
                return res.status(StatusCodes.OK).json({
                    success: true,
                    message: "Đã xử lý reaction",
                    result
                });
        }
    } catch (error) {
        console.error("Lỗi trong handlerReaction:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Lỗi server"
        });
    }
};

// Thêm API endpoint mới để lấy reaction của người dùng cho một đối tượng
export const getUserReaction = async (req, res) => {
    try {
        const { targetType, targetId } = req.params;
        const userId = req.user._id;

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        const result = await reactionService.getUserReactionService({ userId, targetType, targetId });

        if (!result.success) {
            return res.status(StatusCodes.OK).json(result);
        }

        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error("Lỗi trong getUserReaction:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Lỗi server"
        });
    }
};


/**
* 📄 Lấy danh sách bài viết mà user đã reaction hoặc comment
* @param { Object } req - Request từ client
* @param { Object } res - Response trả về
*/
export const getUserInteractedPosts = async (req, res) => {
    try {
        const userId = req.user._id
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        const { page = 1, limit = 10 } = req.query;

        const result = await reactionService.getUserInteractedPosts({
            userId,
            page: parseInt(page),
            limit: parseInt(limit),
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            data: result.posts,
            pagination: result.pagination,
            message: 'Danh sách bài viết đã tương tác',
        });
    } catch (error) {
        console.error('Error in getUserInteractedPosts:', {
            userId: getUserIdFromCookies(req),
            page: req.query.page,
            limit: req.query.limit,
            error: error.message,
        });
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Lỗi server khi lấy danh sách bài viết' });
    }
};


export const deleteForumPost = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Bạn cần đăng nhập để thực hiện hành động này"
            });
        }

        const { postId } = req.body
        const result = await forumService.deletePost(postId, userId);

        if (!result.success) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: result.message
            });
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Xóa bài viết thành công"
        });

    } catch (error) {
        console.error("Error in deleteForumPost:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Lỗi server khi xóa bài viết"
        });
    }
};