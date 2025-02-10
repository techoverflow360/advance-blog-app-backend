const Reply = require('../model/Reply');
const { StatusCodes } = require('http-status-codes');


const getAllRepliesWithCommentId = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const replies = await Reply.findAll({ where: { commentId: commentId }});
        return res.status(StatusCodes.OK).json({ message: "Replies found !", replies: replies });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server Error !"});
    }
}

const replyOnAComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { content } = req.body;
        if(!content) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Reply is empty !"});
        const username = req.user.payload.username;
        const reply = await Reply.create({ commentId, username, content });
        return res.status(StatusCodes.CREATED).json({ message: "Reply created !", reply: reply });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server Error !"});
    }
}

const deleteReplyUsingReplyId = async (req, res) => {
    try {
        const replyId = req.params.id;
        const reply = await Reply.findByPk(replyId);
        if(!reply) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Reply not found !"});
        }
        await reply.destroy();
        return res.status(StatusCodes.OK).json({ message: "Reply deleted !"});
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server Error !"});
    }
}



const updateReplyByReplyId = async (req, res) => {
    try {
        const replyId = req.params.id;
        const { content } = req.body;
        if(!content) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "New reply doesnot found !"});
        }
        const reply = await Reply.findByPk(replyId);
        if(content) reply.content = content;
        await reply.save();
        return res.status(StatusCodes.OK).json({ message: "Reply updated !"});
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error !"});
    }   
}

const likeOnReply = async (req, res) => {
    try {
        const replyId = req.params.replyId;
        const { check, checkDisliked } = req.body;
        const reply = await Reply.findByPk(replyId);
        if(check) reply.likes--;
        else reply.likes++;
        if(checkDisliked) reply.dislikes--;
        reply.save();
        return res.status(StatusCodes.OK).json({ message: "Liked on reply !"});
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error !"});
    }
}

const dislikeOnReply = async (req, res) => {
    try {
        const replyId = req.params.replyId;
        const { check, checkLiked } = req.body;
        const reply = await Reply.findByPk(replyId);
        if(check) reply.dislikes--;
        else reply.dislikes++;
        if(checkLiked) reply.likes--;
        reply.save();
        return res.status(StatusCodes.OK).json({ message: "Disliked on reply !"});
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error !"});
    }
}

module.exports = {
    replyOnAComment, getAllRepliesWithCommentId, deleteReplyUsingReplyId, updateReplyByReplyId, likeOnReply, dislikeOnReply
}