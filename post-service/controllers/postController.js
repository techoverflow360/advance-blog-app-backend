const postPromise = require('../model/Post');  
const { StatusCodes } = require('http-status-codes');
const axios = require('axios');


const getAllPost = async (req, res) => {
    try {
        const Post = await postPromise;
        const posts = await Post.findAll();
        return res.status(StatusCodes.OK).json({ message: "Found posts !", posts: posts  });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

const getPostById = async (req, res) => {
    try {
        const Post = await postPromise;
        const postId = req.params.id;
        const post = await Post.findOne({ where : { id: postId } });
        const response = await axios.get(`http://localhost:8082/comments/${postId}`, {
            headers: {
                'Authorization': `Bearer ${req.user.token}` 
            }
        });
        const comments = response.data.comments;
        if(!post) return res.status(StatusCodes.NOT_FOUND).json({ message: "No post found with this id" });
        return res.status(StatusCodes.OK).json({ message: "Found post !", post: { ...post.dataValues, comments: comments } });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

const createPost = async (req, res) => {
    try {
        const Post = await postPromise;
        const username = req.user.payload.username;
        const { title, content, category } = req.body;
        if(!title) return res.status(StatusCodes.BAD_REQUEST).json({ message : "Title is empty !" });
        if(!content) return res.status(StatusCodes.BAD_REQUEST).json({ message : "Content is empty !" });
        if(!category) return res.status(StatusCodes.BAD_REQUEST).json({ message : "Category is not present !" });
        const post = await Post.create({ title, content, category, username });
        return res.status(StatusCodes.CREATED).json({ message: "Post created !", post: post});
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

const updatePost = async (req, res) => {
    try {
        const Post = await postPromise;
        const postId = req.params.id;
        const post = await Post.findOne({ where : { id: postId } });
        if(!post) return res.status(StatusCodes.NOT_FOUND).json({ message: "No post found with this id " + postId });
        const { title, content, category } = req.body;
        if(title) post.title = title;
        if(content) post.content = content;
        if(category) post.category = category;
        await post.save();
        return res.status(StatusCodes.OK).json({ message: "Post updated !", post: post });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

const deletePost = async (req, res) => {
    try {
        const Post = await postPromise;
        const postId = req.params.id;
        const post = await Post.findOne({ where : { id: postId } });
        if(!post) return res.status(StatusCodes.NOT_FOUND).json({ message: "No post found with this id " + postId });
        await post.destroy();
        return res.status(StatusCodes.OK).json({ message: "Post deleted !"});
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

const getPostByUsername = async (req, res) => {
    try {
        const Post = await postPromise;
        const username = req.user.payload.username;
        const posts = await Post.findAll({ where : { username : username }});
        return res.status(StatusCodes.OK).json({ message: `Fetched all post with username : ${username}`, posts: posts });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

const likePost = async (req, res) => {
    // update likes variable and other cases -> then add user into likedUser array  
    try {
        const Post = await postPromise;
        const postId = req.params.postId;
        const username = req.user.payload.username;
        const { check, checkDisliked } = req.body;
        const post = await Post.findByPk(postId);
        if(check){
            post.likes--;
            post.likedUser = post.likedUser.filter(user => user !== username);
        } else {
            post.likes++;
            post.likedUser = [...post.likedUser, username];
        }
        if(checkDisliked){
            post.dislikes--;
            post.dislikedUser = post.dislikedUser.filter(user => user !== username);
        }
        post.save();
        return res.status(StatusCodes.OK).json({ message: "Liked on post !" });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

const dislikePost = async (req, res) => {
    // update dislikes variable and other cases -> then add user into dislikedUser array  
    try {
        const Post = await postPromise;
        const postId = req.params.postId;
        const username = req.user.payload.username;
        const { check, checkLiked } = req.body;
        const post = await Post.findByPk(postId);
        if(check){
            post.dislikes--;
            post.dislikedUser = post.dislikedUser.filter(user => user !== username);
        } else {
            post.dislikes++;
            post.dislikedUser = [...post.dislikedUser, username];
        }
        if(checkLiked){
            post.likes--;
            post.likedUser = post.likedUser.filter(user => user !== username);
        }
        post.save();
        return res.status(StatusCodes.OK).json({ message: "Liked on post !" });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    getAllPost, getPostById, createPost, updatePost, deletePost, getPostByUsername, likePost, dislikePost
}