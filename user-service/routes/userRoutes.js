const express = require('express');
const { authenticateUser,adminAuthenticate } = require("../utils/util");

const controller = require('../controllers/userController');

const router = express.Router();

router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/:username', authenticateUser, controller.getUser);
router.put('/:username', authenticateUser, controller.updateUser);
router.delete('/:username', authenticateUser, adminAuthenticate, controller.deleteUser);
router.post('/reset-password/:id', controller.resetPassword);
router.put('/change-isDisable/:username',authenticateUser,controller.toggleEnableDisable)
router.get('/isDisabled/:id',controller.getIsDisabledById)
module.exports = router;
