const express = require('express');
const controllers = require('../controllers/postController');
const {authenticateIsDisabled, authenticateUser}=require('../utils/utils')
const router = express.Router();

// called by post service 
router.get('', controllers.getAllPost);
router.get('/:id', controllers.getPostById);
router.post('', authenticateUser, authenticateIsDisabled, controllers.createPost);
router.put('/:id', authenticateUser, authenticateIsDisabled,controllers.updatePost);
router.delete('/:id',authenticateUser, authenticateIsDisabled, controllers.deletePost);
router.get('/user', authenticateUser, controllers.getPostByUsername);

// called by user service 
router.post('/like/:postId', authenticateUser, authenticateIsDisabled, controllers.likePost);
router.post('/dislike/:postId', authenticateUser, authenticateIsDisabled, controllers.dislikePost);

module.exports = router;