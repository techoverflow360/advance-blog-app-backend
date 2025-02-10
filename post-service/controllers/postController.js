const Post = require('../model/Post');  
const { StatusCodes } = require('http-status-codes');
const axios = require('axios');


const getAllPost = async (req, res) => {
    try {
        const posts = await Post.findAll();
        return res.status(StatusCodes.OK).json({ message: "Found posts !", posts: posts  });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

const getPostById = async (req, res) => {
    try {
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

module.exports = {
    getAllPost, getPostById, createPost, updatePost, deletePost
}