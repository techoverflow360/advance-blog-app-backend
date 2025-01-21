const express = require('express')
const controller = require('../controllers/commentController');

const router = express.Router();

router.post('/', controller.createComment);
router.get('/:postId', controller.getCommentsByPostId);
router.delete('/:commentId',controller.deleteCommentByCommentId)
module.exports = router;