import { Router } from "express";
import { createForumPost, updateForumPost } from "../Controller/Forum_Controller.js";

const forumRoutes = Router()

forumRoutes.get('/', (req, res) => {
    console.log('Received request at /api/forum');
    res.status(200).json({ message: 'Hello, welcome to the forum API!' });
});

forumRoutes.post('/newPost', createForumPost);
forumRoutes.put('/updatePost/:id', updateForumPost);
export default forumRoutes