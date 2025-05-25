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
    handlerReaction,
    getRepliesByParent,
    deleteForumPost,
    getUserReaction
} from "../Controller/Forum.Controller.js";
import { checkPostType } from "../Middlewares/checkPostType.js";
// import { uploadPostImages } from "../Middlewares/uploadMiddleware.js";
import { parseFormData } from "../Middlewares/parseFormData.js";
import favoriteListRoute from "./Favourite.routes.js";
import { checkUserAuth } from "../Middlewares/userAuthChecker.js";
import { uploadPostImages } from "../Middlewares/GoogleDriveUploader.js";

const forumRoutes = Router();

// Welcome route
forumRoutes.get('/', (req, res) => {
    console.log('Received request at /api/forum');
    res.status(200).json({ message: 'Hello, welcome to the forum API!' });
});

forumRoutes.use(checkUserAuth)

// Post-related routes
forumRoutes.get('/GET/posts', getForumPosts);
forumRoutes.get('/GET/posts/:Post_id', getPostById);
forumRoutes.post('/posts/new', [
    parseFormData(),     // 1. Xử lý form data và file uploads
    checkPostType,       // 2. Kiểm tra postType
    uploadPostImages()   // 3. Upload ảnh lên Google Drive
], createNewForumPost);
forumRoutes.put('/posts/:post_id', updateForumPost);
forumRoutes.delete('/posts/:post_id', deleteForumPost);

// Comment-related routes
forumRoutes.post('/comments/new', addComment);              // Thêm comment mới
forumRoutes.post('/comments/reply', replyComment);          // Trả lời comment
forumRoutes.get('/comments/:postId', getCommentsByPost);    // Lấy danh sách comment theo post
forumRoutes.delete('/comments/:commentId', deleteComment);  // Xóa comment
forumRoutes.put('/comments/:commentId', updateComment);     // Cập nhật comment
forumRoutes.get('/comments/GET-ReplyComments/:commentId', getRepliesByParent); // Lấy danh sách comment reply của 1 comment id

// Reaction-related routes
forumRoutes.post('/reactions/post', handlerReaction);
forumRoutes.get('/reaction/:targetType/:targetId', getUserReaction);        // Thêm/sửa reaction cho post   // Thêm/sửa reaction cho comment    // Xóa reaction
// forumRoutes.get('/reactions/:postId/:targetId', getReactionsByPost); // Lấy thông tin reactions
forumRoutes.use('/favorite', favoriteListRoute)

export default forumRoutes;