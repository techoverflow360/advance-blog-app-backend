const express = require('express');
const controllers = require('../controllers/postController');
const {authenticateIsDisabled}=require('../utils/utils')
const router = express.Router();

router.get('/', controllers.getAllPost);
router.get('/:id', controllers.getPostById);
router.post('/', authenticateIsDisabled, controllers.createPost);
router.put('/:id', authenticateIsDisabled,controllers.updatePost);
router.delete('/:id',authenticateIsDisabled, controllers.deletePost);

module.exports = router;