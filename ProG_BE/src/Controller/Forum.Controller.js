import { StatusCodes } from "http-status-codes";
import ForumPost from "../models/ForumPost.js";
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config.js';


export const getForumPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, tag, search } = req.query;
        const filter = {};
        if (tag) filter.tags = tag;
        if (search) filter.title = new RegExp(search, "i");

        const posts = await ForumPost.find(filter)
            .populate("author", "username")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(StatusCodes.OK).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy danh sách bài viết" });
    }
};

export const getForumPostById = async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id).populate("author", "username");
        if (!post) return res.status(404).json({ message: "Bài viết không tồn tại" });
        res.status(StatusCodes.OK).json(post);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy bài viết" });
    }
};

export const updateForumPost = async (req, res) => {
    try {
        const user = verifyToken(req);
        const { title, content, tags, imgUrl, postStatus } = req.body;

        const post = await ForumPost.findOneAndUpdate(
            { _id: req.params.id, author: user.id },
            { title, content, tags, imgUrl, postStatus },
            { new: true, runValidators: true }
        );

        if (!post) return res.status(403).json({ message: "Không có quyền cập nhật" });
        res.status(StatusCodes.OK).json({ message: "Cập nhật thành công", post });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi cập nhật bài viết" });
    }
};

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
        const newPost = new ForumPost({
            title,
            content,
            author: userId,
            tags,
            imgUrl,
            postStatus: "open",
        });

        await newPost.save();
        res.status(201).json({ message: "Đăng bài thành công!", post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi đăng bài" });
    }
};

export const addComment = async (req, res) => {
    try {
        const { postId, content, parentComment } = req.body;
        const decodedUser = authenticateUser(req);
        const userId = decodedUser.id;

        // Kiểm tra bài viết có tồn tại không
        const post = await ForumPost.findById(postId);
        if (!post) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bài viết không tồn tại" });

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
