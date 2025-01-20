const express = require('express');
const { authenticateUser } = require("../utils/jwtUtil");

const controller = require('../controllers/userController');

const router = express.Router();

router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/:id', authenticateUser, controller.getUser);
router.put('/:id', authenticateUser, controller.updateUser);
router.delete('/:id', authenticateUser, controller.deleteUser);
router.post("/reset-password/:id", controller.resetPassword);

module.exports = router;
