const { generateToken } = require('../utils/utils');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const BloggerPromise  = require('../model/Blogger');
require('dotenv').config();
const axios=require('axios')


const login = async (req, res) => {
    try {
        const Blogger = await BloggerPromise;
        const { email, password } = req.body;
        if(!email || email.trim() === "") return res.status(StatusCodes.BAD_REQUEST).json({ message : "email is empty !"});
        if(!password || password.trim() === "") return res.status(StatusCodes.BAD_REQUEST).json({ message : "password is empty !"});
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const payload={ email:process.env.ADMIN_EMAIL, isAdmin:true }
            const token = generateToken(payload);
            return res.status(StatusCodes.OK).json({ message : "logged in as Admin!", token : token });   
        }
        const user = await Blogger.findByPk(email);
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({ message : "Blogger doesnot found with this email !"});
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) return res.status(StatusCodes.UNAUTHORIZED).json({ message : "Password is incorrect !"});

        const payload = { email: user.email, username : user.username , isAdmin:false };
        const token = generateToken(payload);
        res.status(StatusCodes.OK).json({ message : "Blogger found and logged in !", token : token });   
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error !"})
    }
}

const register = async (req, res) => {
    try {
        const Blogger = await BloggerPromise;
        const { username, email, password } = req.body;
        if(!username) return res.status(StatusCodes.BAD_REQUEST).json({ message : "Username is empty !" });
        if(!email) return res.status(StatusCodes.BAD_REQUEST).json({ message : "Email is empty !" });
        if(!password) return res.status(StatusCodes.BAD_REQUEST).json({ message : "Password is empty !" });
        const checkUsername = await Blogger.findOne({ where: { username: username } });
        if(checkUsername) return res.status(StatusCodes.UNAUTHORIZED).json({ message : "Username is already taken !" });
        const checkEmail = await Blogger.findOne({ where: { email: email } });
        if(checkEmail) return res.status(StatusCodes.UNAUTHORIZED).json({ message : "Email is already taken "});
        const user = await Blogger.create({ username, email, password });
        return res.status(StatusCodes.CREATED).json({ message: "Blogger created successfully !", user : user });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error !"})
    }
}

const getUser = async (req, res) => {
    try {
        const Blogger = await BloggerPromise;
        const userName = req.user.payload.username;
        const user = await Blogger.findOne({where:{username:userName}});
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({ message : "Blogger not found !" });
        return res.status(StatusCodes.OK).json({ message : "Blogger found !", user : user });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error !"})
    }
}

const deleteUser = async (req, res) => {
    try {
        const Blogger = await BloggerPromise;
        const userName= req.params.username;
        const user = await Blogger.findOne({where:{username:userName}});
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({ message : "Blogger not found !" });
        await user.destroy();
        return res.status(StatusCodes.OK).json({ message : "Blogger deleted successfully !"});    
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error !"})
    }
}

const resetPassword = async (req, res) => {
    try {
        const Blogger = await BloggerPromise;
        const id = req.params.id;
        const { password } = req.body;
        if(password === null || password.trim() === "") return res.status(StatusCodes.BAD_REQUEST).json({message: "Password is empty or null !"}); 
        const user = await Blogger.findByPk(id);
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({ message : "Blogger not found !" });
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(StatusCodes.CREATED).json({ message : "Password is reset successfully !" });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }
}

const toggleEnableDisable=async(req,res)=>{
    try{
        const Blogger = await BloggerPromise;
        const username=req.params.username;
        const user = await Blogger.findOne({where:{username:username}})
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Blogger not found" })
        }
        user.isDisabled=!user.isDisabled
        const updatedUser=await user.save();
        return res.status(StatusCodes.OK).json({message:`currently blogger status : ${ updatedUser.isDisabled? "Disabled":"Enabled"}`})
    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }
}

const getIsDisabledById=async(req,res)=>{
    try{
        const Blogger = await BloggerPromise;
        const username = req.user.payload.username;
        const user = await Blogger.findOne({ where : { username : username }});
        return res.status(StatusCodes.OK).json({ isDisabled : user.isDisabled });
    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }
}

const updateUser = async (req, res) => {
    try {
        const Blogger = await BloggerPromise;
        const userName= req.user.payload.username;
        const { username, firstName, lastName, age } = req.body;
        const user = await Blogger.findOne({where:{username:userName}});
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({ message: "Blogger not found !" });
        let checkUsername = null;
        if(username) checkUsername = await Blogger.findOne({ where: { username : username }});
        if(checkUsername && user.email !== checkUsername.email) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Username already taken, please choose another one"});
        let token = null;
        if(username){
            user.username = username;
            const payload = { email: user.email, username : username , isAdmin:false };
            token = generateToken(payload);
        }
        if(firstName) user.firstName = firstName;
        if(lastName) user.lastName = lastName;
        if(age) user.age = age;
        const updatedUser = await user.save();
        if(token === null) return res.status(StatusCodes.OK).json({ message: "Blogger is updated !", user: updatedUser });
        return res.status(StatusCodes.OK).json({message: "Blogger updated !", token : token, user : updatedUser });

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error !"})
    }
}

//                                               UPDATE ARRAYS ALSO 
const likeComment = async (req, res) => {
    // get commentId -> check already liked then unlike -> if already disliked then undislike -> call comment service -> update user schema 
    try{
        const Blogger = await BloggerPromise;
        const commendId = req.params.commendId;

        const username = req.user.payload.username;
        const user = await Blogger.findOne({where:{username:username}});
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({ message : "Blogger not found !" });
        const checkAlreadyLiked = user.likedComment.includes(commendId);  
        const checkDisliked = user.dislikedComment.includes(commendId);     

        const response=await axios.get(`http://localhost:8082/comments/like/${commendId}`,
            {
                check : checkAlreadyLiked,
                checkDisliked : checkDisliked
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${req.user.token}`
                }
            }
        );
        if(!response){
            return res.status(StatusCodes.NOT_FOUND).json({message:"empty response while cross service request !"})
        }
        
        const newlikedComment = [];
        if(checkAlreadyLiked) newlikedComment = user.likedComment.filter(id => id !== commendId);
        else newlikedComment = [...user.likedComment, commendId];
        if(checkDisliked) {
            user.dislikedComment = user.dislikedComment.filter(id => id !== commendId);
        }
        user.likedComment = newlikedComment;
        user.save();
        
        return res.status(StatusCodes.OK).json({ message: "Blogger liked the comment !" })
    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }
}

const dislikeComment = async (req, res) => {
    // get commentId -> check already disliked then undislike -> if already liked then unliked -> call comment service -> update user schema 
    try{
        const Blogger = await BloggerPromise;
        const commendId = req.params.commendId;

        const username = req.user.payload.username;
        const user = await Blogger.findOne({where:{username:username}});
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({ message : "Blogger not found !" });
        const checkAlreadyDisliked = user.dislikedComment.includes(commendId); 
        const checkLiked = user.likedComment.includes(commendId);

        const response=await axios.get(`http://localhost:8082/comments/dislike/${commendId}`,
            {
                check : checkAlreadyDisliked,
                checkLiked: checkLiked
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${req.user.token}`
                }
            }
        );
        if(!response){
            return res.status(StatusCodes.NOT_FOUND).json({message:"empty response while cross service request !"})
        }
        
        const newdislikedComment = [];
        if(checkAlreadyDisliked) newdislikedComment = user.dislikedComment.filter(id => id !== commendId);
        else newdislikedComment = [...user.dislikedComment, commendId];
        if(checkLiked){
            user.likedComment = user.likedComment.filter(id => id !== commendId);
        }
        user.dislikedComment = newdislikedComment;
        user.save();
        
        return res.status(StatusCodes.OK).json({ message: "Blogger liked the comment !" })
    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }
}

const likeReply = async (req, res) => {
    // get replyId -> check already liked then unlike -> check dislike then undislike -> call comment service -> update user schema 
    try{
        const Blogger = await BloggerPromise;
        const replyId = req.params.replyId;

        const username = req.user.payload.username;
        const user = await Blogger.findOne({where:{username:username}});
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({ message : "Blogger not found !" });
        const checkAlreadyLiked = user.likedReply.includes(replyId); 
        const checkDisliked = user.dislikedReply.includes(replyId);

        const response=await axios.get(`http://localhost:8082/replies/like/${replyId}`,
            {
                check : checkAlreadyLiked,
                checkDisliked: checkDisliked
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${req.user.token}`
                }
            }
        );
        if(!response){
            return res.status(StatusCodes.NOT_FOUND).json({message:"empty response while cross service request !"})
        }

        const newlikedReply = [];
        if(checkAlreadyLiked) newlikedReply = user.likedReply.filter(id => id !== replyId);
        else newlikedReply = [...user.likedReply, replyId];
        if(checkDisliked) {
            user.dislikedReply = user.dislikedReply.filter(id => id !== replyId);
        }
        user.likedReply = newlikedReply;
        user.save();
        
        return res.status(StatusCodes.OK).json({ message: "Blogger liked the reply !" })
    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }   
}

const dislikeReply = async (req, res) => {
    // get replyId -> check already disliked then undislike -> check like then unlike -> call comment service -> update user schema 
    try{
        const Blogger = await BloggerPromise;
        const replyId = req.params.replyId;

        const username = req.user.payload.username;
        const user = await Blogger.findOne({where:{username:username}});
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({ message : "Blogger not found !" });
        const checkAlreadyDisliked = user.dislikedReply.includes(replyId); 
        const checkLiked = user.likedReply.includes(replyId);

        const response=await axios.get(`http://localhost:8082/replies/dislike/${replyId}`,
            {
                check : checkAlreadyDisliked,
                checkLiked: checkLiked
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${req.user.token}`
                }
            }
        );
        if(!response){
            return res.status(StatusCodes.NOT_FOUND).json({message:"empty response while cross service request !"})
        }

        const newDislikedReply = [];
        if(checkAlreadyDisliked) newDislikedReply = user.dislikedReply.filter(id => id !== replyId);
        else newDislikedReply = [...user.dislikedReply, replyId];
        if(checkLiked) {
            user.likedReply = user.likedReply.filter(id => id !== replyId);
        }
        user.dislikedReply = newDislikedReply;
        user.save();

        return res.status(StatusCodes.OK).json({ message: "Blogger disliked the reply !" })
    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }
}

const likePost = async (req, res) => {
    // get postId -> check already liked then unlike -> check dislike then undislike -> call post service -> update user schema by title
    try {
        const Blogger = await BloggerPromise;
        const postId = req.params.postId;

        const username = req.user.payload.username;
        const user = await Blogger.findOne({where:{username:username}});
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({ message : "Blogger not found !" });
        const checkAlreadyLiked = user.likedPost.includes(postId); 
        const checkDisliked = user.dislikedPost.includes(postId);

        const response=await axios.get(`http://localhost:8081/posts/like/${postId}`,
            {
                check : checkAlreadyLiked,
                checkDisliked: checkDisliked
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${req.user.token}`
                }
            }
        );
        if(!response){
            return res.status(StatusCodes.NOT_FOUND).json({message:"empty response while cross service request !"})
        }

        const newlikedPost = [];
        if(checkAlreadyLiked) newlikedPost = user.likedPost.filter(id => id !== postId);
        else newlikedPost = [...user.likedPost, postId];
        if(checkDisliked) {
            user.dislikedPost = user.dislikedPost.filter(id => id !== postId);
        }
        user.likedPost = newlikedPost;
        user.save();

        return res.status(StatusCodes.OK).json({ message: "Blogger liked the post !" })
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

const dislikePost = async (req, res) => {
    // get postId -> check already disliked then undislike -> check like then unlike -> call post service -> update user schema by title
    try {
        const Blogger = await BloggerPromise;
        const postId = req.params.postId;

        const username = req.user.payload.username;
        const user = await Blogger.findOne({where:{username:username}});
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({ message : "Blogger not found !" });
        const checkAlreadyDisliked = user.dislikedPost.includes(postId); 
        const checkLiked = user.likedPost.includes(postId);

        const response=await axios.get(`http://localhost:8081/posts/dislike/${postId}`,
            {
                check : checkAlreadyDisliked,
                checkLiked: checkLiked
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${req.user.token}`
                }
            }
        );
        if(!response){
            return res.status(StatusCodes.NOT_FOUND).json({message:"empty response while cross service request !"})
        }

        const newDislikedPost = [];
        if(checkAlreadyDisliked) newDislikedPost = user.dislikedPost.filter(id => id !== postId);
        else newDislikedPost = [...user.dislikedPost, postId];
        if(checkLiked) {
            user.likedPost = user.likedPost.filter(id => id !== postId);
        }
        user.dislikedPost = newDislikedPost;
        user.save();

        return res.status(StatusCodes.OK).json({ message: "Blogger disliked the post !" })
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}


module.exports = {
    login , register, getUser, updateUser, deleteUser, resetPassword,toggleEnableDisable, getIsDisabledById,
    likeComment, dislikeComment, likeReply, dislikeReply, likePost, dislikePost
}

