import { StatusCodes } from "http-status-codes";
import ForumPost from "../models/ForumPost.js";
import * as forumService from "../services/Forum/Forum.service.js";
import { getUserIdFromCookies } from "../services/User/User.service.js";

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
        const { postId, content, parentComment } = req.body;
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
        const newComment = new Comment({
            content,
            author: userId,
            postId,
            postType: "ForumPost",
            parentComment,
            depth: parentComment ? 1 : 0
        });

        await newComment.save();
        res.status(StatusCodes.CREATED).json({ message: "Đã thêm comment", comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};

export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ postId }).populate("author", "username");
        res.status(StatusCodes.OK).json(comments);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const decodedUser = authenticateUser(req);
        const userId = decodedUser.id;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(StatusCodes.NOT_FOUND).json({ message: "Comment không tồn tại" });

        if (comment.author.toString() !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Không có quyền xóa comment này" });
        }

        await comment.remove();
        res.status(StatusCodes.OK).json({ message: "Đã xóa comment" });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};

export const replyToComment = async (req, res) => {
    try {
        const { commentId, content } = req.body;
        const decodedUser = authenticateUser(req);
        const userId = decodedUser.id;

        const parentComment = await Comment.findById(commentId);
        if (!parentComment) return res.status(StatusCodes.NOT_FOUND).json({ message: "Comment cha không tồn tại" });

        const newReply = new Comment({
            content,
            author: userId,
            postId: parentComment.postId,
            postType: parentComment.postType,
            parentComment: commentId,
            depth: parentComment.depth + 1
        });

        await newReply.save();
        res.status(StatusCodes.CREATED).json({ message: "Đã thêm trả lời", reply: newReply });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};


export const addReaction = async (req, res) => {
    try {
        const { postId, type } = req.body;
        const decodedUser = authenticateUser(req);
        const userId = decodedUser.id;

        // Kiểm tra bài viết có tồn tại không
        const post = await ForumPost.findById(postId);
        if (!post) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bài viết không tồn tại" });

        const existingReaction = await PostReaction.findOne({ user: userId, postId });

        if (existingReaction) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Bạn đã thả reaction trước đó" });
        }

        const newReaction = new PostReaction({ user: userId, postId, type });
        await newReaction.save();

        res.status(StatusCodes.CREATED).json({ message: "Đã thả reaction", reaction: newReaction });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};

export const removeReaction = async (req, res) => {
    try {
        const { postId } = req.body;
        const decodedUser = authenticateUser(req);
        const userId = decodedUser.id;

        const reaction = await PostReaction.findOne({ user: userId, postId });
        if (!reaction) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bạn chưa thả reaction nào" });

        await reaction.remove();
        res.status(StatusCodes.OK).json({ message: "Đã gỡ reaction" });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};

export const getReactionsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const reactions = await PostReaction.find({ postId });

        const reactionCount = reactions.reduce((acc, curr) => {
            acc[curr.type] = (acc[curr.type] || 0) + 1;
            return acc;
        }, {});

        res.status(StatusCodes.OK).json(reactionCount);
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
        const decodedUser = authenticateUser(req);
        const userId = decodedUser.id;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(StatusCodes.NOT_FOUND).json({ message: "Comment không tồn tại" });

        if (comment.author.toString() !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Không có quyền chỉnh sửa comment này" });
        }

        comment.content = content;
        comment.editedAt = new Date(); // Lưu thời gian chỉnh sửa
        await comment.save();

        res.status(StatusCodes.OK).json({ message: "Đã cập nhật comment", comment });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server" });
    }
};
