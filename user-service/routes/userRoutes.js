const express = require('express');
const { authenticateUser,adminAuthenticate, authenticateIsDisabled} = require("../utils/utils");

const controller = require('../controllers/userController');

const router = express.Router();

// for user purpose 
router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/user', authenticateUser, controller.getUser);
router.post('/reset-password/:id', controller.resetPassword);   // done before login, so no need for authentication  
router.get('/isDisabled', authenticateUser, controller.getIsDisabledById);

// for below : check authenticate + isDisabled  
router.put('/user', authenticateUser, authenticateIsDisabled, controller.updateUser);
router.post('/like-comment/:commentId', authenticateUser, authenticateIsDisabled, controller.likeComment);
router.post('/dislike-comment/:commentId', authenticateUser, authenticateIsDisabled, controller.dislikeComment);
router.post('/like-reply/:replyId', authenticateUser, authenticateIsDisabled, controller.likeReply);
router.post('/dislike-reply/:replyId', authenticateUser, authenticateIsDisabled, controller.dislikeReply);
router.post('/like-post/:postId', authenticateUser, authenticateIsDisabled, controller.likePost);
router.post('/dislike-post/:postId', authenticateUser, authenticateIsDisabled, controller.dislikePost);




// for admin purpose 
router.delete('/:username', authenticateUser, adminAuthenticate, controller.deleteUser);
router.put('/changeIsDisable/:username', authenticateUser, adminAuthenticate, controller.toggleEnableDisable);

module.exports = router;
