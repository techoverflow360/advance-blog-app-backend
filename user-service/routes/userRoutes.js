const express = require('express');
const { authenticateUser,adminAuthenticate, authenticateIsDisabled} = require("../utils/util");

const controller = require('../controllers/userController');

const router = express.Router();

// for user purpose 
router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/user', authenticateUser, controller.getUser);
router.post('/reset-password/:id', controller.resetPassword);   // done before login, so no need for authentication  
router.get('/isDisabled/:id', authenticateUser, controller.getIsDisabledById);

// for below : check authenticate + isDisabled  
router.put('/:username', authenticateUser, authenticateIsDisabled, controller.updateUser);
router.post('/like/commentId', authenticateUser, authenticateIsDisabled, controller.likeComment);
router.post('/dislike/commentId', authenticateUser, authenticateIsDisabled, controller.dislikeComment);
router.post('/like/replyId', authenticateUser, authenticateIsDisabled, controller.likeReply);
router.post('/dislike/replyId', authenticateUser, authenticateIsDisabled, controller.dislikeReply);





// for admin purpose 
router.delete('/:username', authenticateUser, adminAuthenticate, controller.deleteUser);
router.put('/change-isDisable/:username', authenticateUser, adminAuthenticate, controller.toggleEnableDisable);

module.exports = router;
