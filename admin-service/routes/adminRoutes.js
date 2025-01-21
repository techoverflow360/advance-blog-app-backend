const express=require('express');
const router=express.Router();
const controller=require('../controller/adminController')

router.post('/getUser/:username',controller.getUserByUsername);
router.delete('/deleteUser/:username',controller.deleteUserByUsername)
router.get('/getPost/:id',controller.getPostById)
router.delete('/deletepost/:id',controller.deletePostById)
router.delete('/deletecomment/:id',controller.deleteCommmentById)
router.put('enable-disable/:username',controller.toggleEnableDisable)

module.exports=router;