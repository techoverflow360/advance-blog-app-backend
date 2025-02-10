const axios=require('axios')
const { StatusCodes } = require('http-status-codes');

const getUserByUsername=async(req,res)=>{
    try{
        const username=req.params.username
        const response=await axios.get(`http://localhost:8080/users/${username}`,{
            headers:{
                'Authorization':`Bearer ${req.user.token}`
            }
        });
        if(!response){
            return res.status(StatusCodes.NOT_FOUND).json({message:"empty response while fetching user from user service "})
        }
        return res.status(StatusCodes.OK).json({message:"user found ",user:response.data.user})
    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }
}

const deleteUserByUsername=async(req,res)=>{
    try{
        const username=req.params.username
        const response=await axios.delete(`http://localhost:8080/users/${username}`,{
            headers:{
                Authorization:`Bearer ${req.user.token}`
            }
        });

        if(!response){
            return res.status(StatusCodes.NOT_FOUND).json({message:"No response from user delete api"})
        }
        return res.status(StatusCodes.OK).json({message:"user deleted by admin user "})

    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }
}

const getPostById=async(req,res)=>{
    try{
        const postid=req.params.id // ye kaise aaya 
        const response=await axios.get(`http://localhost:8081/posts/${postid}`,{
            headers:{
                Authorization:`Bearer ${req.user.token}`
            }
        });

        if(!response){
            return res.status(StatusCodes.NOT_FOUND).json({message:"didn't get any response"})
        }
        const post=response.data.post;
        if(!post){
            return res.status(StatusCodes.NOT_FOUND).json({message:"didn't get any post"})
        }
        return res.status(StatusCodes.OK).json({message:"post found",post:post})

    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }
}


const deletePostById=async(req,res)=>{
    try{
        const postid=req.params.id;
        const response=await axios.delete(`http://localhost:8081/posts/${postid}`,{
            headers:{
                Authorization:`Bearer ${req.user.token}`
            }
        }
        )
        if(!response){
            return res.status(StatusCodes.NOT_FOUND).json({message:"didn't get any response"})
        }
        return res.status(StatusCodes.OK).json({message: 'post deleted'})


    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }
}

const deleteCommmentById=async(req,res)=>{
    try{
        const commentid=req.params.id;
        const response=await axios.delete(`http://localhost:8082/comments/${commentid}`,{
            headers:{
                Authorization:`Bearer ${req.user.token}`
            }
        });
        if(!response){
            return res.status(StatusCodes.NOT_FOUND).json({message:"didn't get any response"})
        }
        return res.status(StatusCodes.OK).json({message:response.data.message});
           
    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }
}

const toggleEnableDisable=async(req,res)=>{
    try{
        const username=req.params.username;
        const response=await axios.put(`http://localhost:8080/users/change-isDisable/${username}`,{
            headers:{
                Authorization:`Bearer ${req.user.token}`
            }
        });
        
        if(!response){
            return res.status(StatusCodes.NOT_FOUND).json({message:"didn't get any response"})
        }
        return res.status(StatusCodes.OK).json({message: response.data.message});

    }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "Internal Server error !"});
    }
}

module.exports={
    toggleEnableDisable,deleteCommmentById,deletePostById,getPostById,deleteUserByUsername,getUserByUsername
}
