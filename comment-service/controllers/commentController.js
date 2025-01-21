const Comment = require('../model/Comment');
const axios = require('axios');

const createComment = async (req, res) => {
    try {
        const { comment, postId } = req.body;
        const userId = req.user.payload.email;
        const response = await axios.get(`http://localhost:8080/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${req.user.token}` 
            }
        });
        const username = response.data.user.username;
        const commnt = await Comment.create({ comment, postId, username });
        res.status(201).json({ message: 'Comment created successfully', comment: commnt });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error !" });
    }
};

const getCommentsByPostId = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.findAll({ where: { postId: postId }});
        comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return res.status(200).json({ message : "Comments are found !", comments: comments });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error !" });
    }
};

const deleteCommentByCommentId=async(req,res)=>{
    try{
        const id=req.params.commentId;
        const comment=await Comment.findByPk(id) //where:{ id:id}
        if(!comment){
            return res.status(400).json({message:'comment id not exist'})
        }
        await comment.destroy();
        return res.status(200).json({message:'comment deleted of specific id'})

    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error !" });
   
    }
};
module.exports = {
    createComment, getCommentsByPostId,deleteCommentByCommentId
}