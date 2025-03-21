const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ...existing code...

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/create-post', userController.createPost);
router.put('/edit-post/:id', userController.editPost);
router.delete('/delete-post/:id', userController.deletePost);

module.exports = router;
