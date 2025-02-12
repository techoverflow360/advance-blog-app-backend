const express = require('express')
const controller = require('../controllers/replyController');
const { authenticateUser, authenticateIsDisabled } = require('../utils/utils');

const router = express.Router();

// no option to reply on a reply, just reply on a comment
router.get('/comment/:commentId', controller.getAllRepliesWithCommentId);   // calls while pressing button showing count replies
router.post('/:commentId', authenticateUser, authenticateIsDisabled, controller.replyOnAComment);
router.delete('/:id', authenticateUser, authenticateIsDisabled, controller.deleteReplyUsingReplyId);
router.put('/:id', authenticateUser, authenticateIsDisabled, controller.updateReplyByReplyId);

router.post('/like/:replyId', authenticateUser, authenticateIsDisabled, controller.likeOnReply);
router.post('/dislike/:replyId', authenticateUser, authenticateIsDisabled, controller.dislikeOnReply);

module.exports = router;
