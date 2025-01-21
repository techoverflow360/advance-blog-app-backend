const Post = require('../model/Post');  
const axios = require('axios');


const getAllPost = async (req, res) => {
    try {
        const posts = await Post.findAll();
        return res.status(200).json({ message: "Found posts !", posts: posts  });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
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
        if(!post) return res.status(400).json({ message: "No post found with this id" });
        return res.status(200).json({ message: "Found post !", post: { ...post.dataValues, comments: comments } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const createPost = async (req, res) => {
    try {
        const authorId = req.user.payload.email;
        // since post should show username of author, so we request user-service to give user info from email
        const response = await axios.get(`http://localhost:8080/users/${authorId}`, {
                headers: {
                    'Authorization': `Bearer ${req.user.token}` 
                }
        });
        const username = response.data.user.username;
        const { title, content, category } = req.body;
        if(!title) return res.status(400).json({ message : "Title is empty !" });
        if(!content) return res.status(400).json({ message : "Content is empty !" });
        if(!category) return res.status(400).json({ message : "Category is not present !" });
        const post = await Post.create({ title, content, category, username });
        return res.status(201).json({ message: "Post created !", post: post});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findOne({ where : { id: postId } });
        if(!post) return res.status(400).json({ message: "No post found with this id " + postId });
        const { title, content, category } = req.body;
        if(title) post.title = title;
        if(content) post.content = content;
        if(category) post.category = category;
        await post.save();
        return res.status(200).json({ message: "Post updated !", post: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findOne({ where : { id: postId } });
        if(!post) return res.status(400).json({ message: "No post found with this id " + postId });
        await post.destroy();
        return res.status(200).json({ message: "Post deleted !"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    getAllPost, getPostById, createPost, updatePost, deletePost
}