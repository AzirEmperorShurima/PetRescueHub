import { Router } from "express";
import {
    getForumPosts,
    getPostById,
    updateForumPost,
    createNewForumPost,
    addComment,
    replyComment,
    getCommentsByPost,
    deleteComment,
    updateComment,
    handlerPostReaction,
    handlerCommentReaction,
    removeReaction,
    getReactionsByPost
} from "../Controller/Forum.Controller.js";

const forumRoutes = Router();

// Welcome route
forumRoutes.get('/', (req, res) => {
    console.log('Received request at /api/forum');
    res.status(200).json({ message: 'Hello, welcome to the forum API!' });
});

// Post-related routes
forumRoutes.get('/posts', getForumPosts);
forumRoutes.get('/posts/:Post_id', getPostById);
forumRoutes.post('/posts/new', createNewForumPost);
forumRoutes.put('/posts/:post_id', updateForumPost);

// Comment-related routes
forumRoutes.post('/comments/new', addComment);                  // Thêm comment mới
forumRoutes.post('/comments/reply', replyComment);          // Trả lời comment
forumRoutes.get('/comments/:postId', getCommentsByPost);    // Lấy danh sách comment theo post
forumRoutes.delete('/comments/:commentId', deleteComment);  // Xóa comment
forumRoutes.put('/comments/:commentId', updateComment);     // Cập nhật comment

// Reaction-related routes
forumRoutes.post('/reactions/post', handlerPostReaction);          // Thêm/sửa reaction cho post
forumRoutes.post('/reactions/comment', handlerCommentReaction);    // Thêm/sửa reaction cho comment
forumRoutes.delete('/reactions', removeReaction);                  // Xóa reaction
forumRoutes.get('/reactions/:postId/:targetId', getReactionsByPost); // Lấy thông tin reactions

export default forumRoutes;