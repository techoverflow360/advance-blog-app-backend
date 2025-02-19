const express = require('express')
const controller = require('../controllers/commentController');
const { authenticateUser, authenticateIsDisabled } = require('../utils/utils');

const router = express.Router();

router.get('/post/:postId', controller.getCommentsByPostId);
router.post('', authenticateUser, authenticateIsDisabled, controller.createComment);
router.delete('/:commentId', authenticateUser, authenticateIsDisabled, controller.deleteCommentByCommentId);
router.put('/:commentId', authenticateUser, authenticateIsDisabled, controller.updateCommentByCommentId);

router.post('/like/:commentId', authenticateUser, authenticateIsDisabled, controller.likeOnComment);
router.post('/dislike/:commentId', authenticateUser, authenticateIsDisabled, controller.dislikeOnComment);


module.exports = router;