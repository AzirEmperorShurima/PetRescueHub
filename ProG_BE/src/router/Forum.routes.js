import { Router } from "express";
import { createForumPost } from "../Controller/Forum_Controller.js";

const forumRoutes = Router()

forumRoutes.get('/', (req, res) => {
    console.log('Received request at /api/forum');
    res.status(200).json({ message: 'Hello, welcome to the forum API!' });
});

forumRoutes.post('/newPost', createForumPost);

export default forumRoutes