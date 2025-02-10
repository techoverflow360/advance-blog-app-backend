const Comment = require('../model/Comment');
const Reply = require('../model/Reply');
const { StatusCodes } = require('http-status-codes');
const axios = require('axios');

const createComment = async (req, res) => {
    try {
        const { comment, postId } = req.body;
        const username = req.user.payload.username;
        const commnt = await Comment.create({ comment, postId, username });
        res.status(StatusCodes.CREATED).json({ message: 'Comment created successfully', comment: commnt });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error !" });
    }
};

const getCommentsByPostId = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.findAll({ where: { postId: postId }});
        comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // for each comments also store the count of replies with that commentId
        comments = comments.map(async (comment) => {
            const id = comment.id;
            const replyCount = await Reply.count({ where: { commentId: id } });
            return { ...comment, replyCount: replyCount };
        })
        return res.status(StatusCodes.OK).json({ message : "Comments are found !", comments: comments });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error !" });
    }
};

const deleteCommentByCommentId=async(req,res)=>{
    try{
        const id=req.params.commentId;
        const comment=await Comment.findByPk(id) //where:{ id:id}
        if(!comment){
            return res.status(StatusCodes.NOT_FOUND).json({message:'comment id not exist'})
        }
        // no need to delete replies since it already deleted using cascade 
        await comment.destroy();
        return res.status(StatusCodes.OK).json({message:'comment deleted of specific id'})

    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error !" });
   
    }
};

const updateCommentByCommentId = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { comment } = req.body;
        if(!comment) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Comment text doesnot found !"});
        }
        const getcomment = await Comment.findByPk(commentId);
        if(comment) getcomment.comment = comment;
        await getcomment.save();
        return res.status(StatusCodes.OK).json({ message: "Comment updated !"});
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error !"});
    }
};

const likeOnComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { check, checkDisliked } = req.body;
        const comment = await Comment.findByPk(commentId);
        if(check) comment.likes--;
        else comment.likes++;
        if(checkDisliked) comment.dislikes--;
        comment.save();
        return res.status(StatusCodes.OK).json({ message: "Liked the comment !"});
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error !"});
    }
}

const dislikeOnComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { check, checkLiked } = req.body;
        const comment = await Comment.findByPk(commentId);
        if(check) comment.dislikes--;
        else comment.dislikes++;
        if(checkLiked) comment.likes--;
        comment.save();
        return res.status(StatusCodes.OK).json({ message: "Disliked the comment !"});
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error !"});
    }
}

module.exports = {
    createComment, getCommentsByPostId, deleteCommentByCommentId
    , updateCommentByCommentId, likeOnComment, dislikeOnComment
}