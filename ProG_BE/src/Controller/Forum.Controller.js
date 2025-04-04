import { StatusCodes } from "http-status-codes";
import ForumPost from "../models/ForumPost.js";
import * as forumService from "../services/Forum/Forum.service.js";
import * as commentService from "../services/Comments/Comments.service.js"
import * as reactionService from "../services/Reaction/Reaction.service.js";
import { getUserIdFromCookies } from "../services/User/User.service.js";
import { CommentModel } from "../models/CommentsSchema.js";
import Reaction from "../models/ReactionSchema.js";


export const getForumPosts = async (req, res) => {
    const requestOptions = {
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort || { createdAt: -1 },
        search: req.query.search || "",
        tag: req.query.tag || "",
        postType: req.query.postType || ""
    }
    const result = await forumService.getListForumPosts(requestOptions);

    if (result.success) {
        return res.status(StatusCodes.OK).json(result.data);
    } else {
        return res.status(500).json({ message: result.message });
    }
};

export const getPostById = async (req, res) => {
    const result = await forumService.getPostById(req.params.Post_id);

    if (result.success) {
        return res.status(StatusCodes.OK).json(result.data);
    } else {
        return res.status(404).json({ message: result.message });
    }
};

export const updateForumPost = async (req, res) => {
    try {
        const userId = getUserIdFromCookies(req);
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
        if (tags && JSON.stringify(tags) !== JSON.stringify(postFound.tags)) {
            updateData.tags = tags;
        }
        if (imgUrl && JSON.stringify(imgUrl) !== JSON.stringify(postFound.imgUrl)) {
            updateData.imgUrl = imgUrl;
        }
        if (postStatus && postStatus !== postFound.postStatus) {
            updateData.postStatus = postStatus;
        }

        // Nếu không có thay đổi nào, trả về thông báo
        if (Object.keys(updateData).length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không có thay đổi nào để cập nhật" });
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
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi cập nhật bài viết" });
    }
};

export const createNewForumPost = async (req, res) => {
    try {
        const { title, content, tags, imgUrl } = req.body;

        const userId = getUserIdFromCookies(req);

        if (!title || !content) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Tiêu đề và nội dung không được để trống" });
        }

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        const result = await forumService.createPost(
            title,
            content,
            tags,
            imgUrl,
            userId
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
        const userId = getUserIdFromCookies(req);
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành đ��ng này" });
        }

        // Kiểm tra bài viết có tồn tại không
        const post = await ForumPost.findById(postId);
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
        const userId = getUserIdFromCookies(req);
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành đ��ng này" });
        }
        const parent_commment = await CommentModel.findById(parentComment);
        if (!parent_commment) return res.status(StatusCodes.NOT_FOUND).json({ message: "Parent Comment Does Not Exist" });

        // Kiểm tra bài viết có tồn tại không
        const post = await ForumPost.findById(postId);
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
export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const listComments = await commentService.getCommentsByPostIdService(postId);
        if (!listComments.success) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: listComments.message });
        }
        res.status(StatusCodes.OK).json(listComments.data);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = getUserIdFromCookies(req);
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        const comment = await CommentModel.findById(commentId);
        if (!comment) return res.status(StatusCodes.NOT_FOUND).json({ message: "Comment không tồn tại" });

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
        const userId = getUserIdFromCookies(req);
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
export const handlerPostReaction = async (req, res) => {
    try {
        const { targetId, reactionTypes, rawTypes } = req.body;
        const userId = getUserIdFromCookies(req);
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        if (!reactionTypes) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Type không được để trống" });
        }
        if (!targetId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "PostId không được để trống" });
        }

        // Kiểm tra bài viết có tồn tại không
        const target = await reactionService.getTargetType(targetId, rawTypes || "Post");
        if (!target) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Bài viết không tồn tại" });
        }
        const targetType = target.targetType;

        const newReaction = await reactionService.addOrUpdateReaction(userId, targetType, targetId, reactionTypes);
        if (!newReaction) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi trong quá trình thêm reaction" });
        }
        res.status(StatusCodes.CREATED).json({ message: "Đã thêm reaction", reaction: newReaction });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};


export const handlerCommentReaction = async (req, res) => {
    try {
        const { targetId, reactionTypes } = req.body;
        const userId = getUserIdFromCookies(req);
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        if (!reactionTypes) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "ReactionType không được để trống" });
        }
        if (!targetId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Comment id không được để trống" });
        }

        // Kiểm tra bài viết có tồn tại không
        const targetComments = await CommentModel.findById(targetId);
        if (!targetComments) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Comment không tồn tại" });
        }

        const newReaction = await reactionService.addOrUpdateCommentReaction(userId, targetId, reactionTypes);
        if (!newReaction) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi trong quá trình thêm reaction" });
        }
        res.status(StatusCodes.CREATED).json({ message: "Đã thêm reaction", reaction: newReaction });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};

export const removeReaction = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = getUserIdFromCookies(req);
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        if (!postId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "PostId không được để trống" });
        }

        const reaction = await reactionService.removeReaction(userId, postId);
        if (!reaction) return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Bạn chưa thả reaction nào" });

        await reaction.remove();
        res.status(StatusCodes.OK).json({ message: "Đã gỡ reaction" });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};

export const getReactionsByPost = async (req, res) => {
    try {
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


