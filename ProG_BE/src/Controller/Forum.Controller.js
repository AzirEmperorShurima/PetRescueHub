import { StatusCodes } from "http-status-codes";
import { ForumPost, PostModel } from "../models/PostSchema.js";
import * as forumService from "../services/Forum/Forum.service.js";
import * as commentService from "../services/Comments/Comments.service.js"
import * as reactionService from "../services/Reaction/Reaction.service.js";
import { getUserFieldFromToken } from "../services/User/User.service.js";
import { CommentModel } from "../models/CommentsSchema.js";
import Reaction from "../models/ReactionSchema.js";
import { COOKIE_PATHS } from "../../config.js";

export const getForumPosts = async (req, res) => {
    try {
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
    const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        const { title, content, tags, imgUrl, postStatus } = req.body;
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
        if (title && title.trim() !== postFound.title) {
            updateData.title = title.trim();
        }
        if (content && content.trim() !== postFound.content) {
            updateData.content = content.trim();
        }

        // Xử lý tags: so sánh mảng bất kể thứ tự
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

        // Nếu không có thay đổi nào, trả về response với bài viết hiện tại
        if (Object.keys(updateData).length === 0) {
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Không có thay đổi nào được thực hiện",
                post: postFound
            });
        }
        const result = await forumService.updatePost(
            req.params.post_id,
            userId,
            updateData
        );

        if (result.success) {
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
        const { title, content, tags, imgUrl, postType } = req.body;

        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        if (!title || !content) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Tiêu đề và nội dung không được để trống" });
        }

        const result = await forumService.createPost(
            title,
            content,
            tags,
            imgUrl,
            userId,
            postType
        );

        if (result.success) {
            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Đăng bài thành công!",
                post: result.post
            });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: result.message || "Lỗi trong quá trình tạo bài viết"
        });

    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Lỗi server khi đăng bài"
        });
    }
};

export const addComment = async (req, res) => {
    try {
        const { postId, content } = req.body;
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
    const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        if (!reactionType) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Loại reaction không được để trống' });
        }
        if (!targetId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Target ID không được để trống' });
        }

        const validTargetTypes = Object.keys(PostModel.discriminators || {}).concat(['Post', 'Comment']);
        if (!validTargetTypes.includes(targetType)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Target type không hợp lệ, phải là một trong: ${validTargetTypes.join(', ')}` });
        }
        const validReactionTypes = Reaction.schema.paths.reactionType.enumValues;
        if (!validReactionTypes.includes(reactionType)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Loại reaction không hợp lệ, phải là một trong: ${validReactionTypes.join(', ')}` });
        }

        const newReaction = await reactionService.addOrUpdateReaction(userId, targetType, targetId, reactionType);
        if (!newReaction) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi trong quá trình thêm reaction" });
        }
        res.status(StatusCodes.CREATED).json({ message: "Đã thêm reaction", reaction: newReaction });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};

export const getReactionsByPost = async (req, res) => {
    try {
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        const { postId, targetId } = req.params;
        if (!postId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "PostId không được để trống" });
        }
        if (!targetId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "TargetId không được để trống" });
        }
        const reactionCount = await reactionService.getReactionsService({ targetType: "Post", targetId: targetId });
        if (!reactionCount || Object.keys(reactionCount).length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không có reaction nào" });
        }
        res.status(StatusCodes.OK).json({
            message: "Lấy thông tin reaction thành công",
            reactionCount: reactionCount,
        });

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};


/**
* 📄 Lấy danh sách bài viết mà user đã reaction hoặc comment
* @param { Object } req - Request từ client
* @param { Object } res - Response trả về
*/
export const getUserInteractedPosts = async (req, res) => {
    try {
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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