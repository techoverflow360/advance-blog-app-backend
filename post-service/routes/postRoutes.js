const express = require('express');
const controllers = require('../controllers/postController');

const router = express.Router();

router.get('/', controllers.getAllPost);
router.get('/:id', controllers.getPostById);
router.post('/', controllers.createPost);
router.put('/:id', controllers.updatePost);
router.delete('/:id', controllers.deletePost);

module.exports = router;