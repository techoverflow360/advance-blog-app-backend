const express=require('express');
const router=express.Router();
const controller=require('../controller/adminController')
    
router.get('/get-user/:username', controller.getUserByUsername);
router.delete('/delete-user/:username', controller.deleteUserByUsername)
router.get('/get-post/:id', controller.getPostById)
router.delete('/delete-post/:id', controller.deletePostById)
router.delete('/delete-comment/:id', controller.deleteCommmentById)
router.put('enable-disable/:username', controller.toggleEnableDisable)

module.exports=router;