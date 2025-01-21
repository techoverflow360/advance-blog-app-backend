const axios=require('axios')

const getUserByUsername=async(req,res)=>{
    try{
        const username=req.params.username
        const response=await axios.get(`http://localhost:8080/users/${username}`,{
            headers:{
                'Authorization':`Bearer ${req.user.token}`
            }
        });
        if(!response){
            return res.status(400).json({message:"empty response while fetching user from user service "})
        }
        return res.status(200).json({message:"user found ",user:response.data.user})
    }catch(error){
        console.log(error);
        return res.status(500).json({ message : "Internal Server error !"});
    }
}

//asdasfas
const deleteUserByUsername=async(req,res)=>{
    try{
        const username=req.params.username
        const response=await axios.delete(`http://localhost:8080/users/${username}`,{
            headers:{
                Authorization:`Bearer ${req.user.token}`
            }
        });

        if(!response){
            return res.status(400).json({message:"No response from user delete api"})
        }
        return res.status(200).json({message:"user deleted by admin user "})

    }catch(error){
        console.log(error);
        return res.status(500).json({ message : "Internal Server error !"});
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
            return res.status().json({message:"didn't get any response"})
        }
        const post=response.data.post;
        if(!post){
            return res.status(400).json({message:"didn't get any post"})
        }
        return res.status(200).json({message:"post found",post:post})

    }catch(error){
        console.log(error);
        return res.status(500).json({ message : "Internal Server error !"});
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
            return res.status().json({message:"didn't get any response"})
        }
        return res.status(200).json({message: 'post deleted'})


    }catch(error){
        console.log(error);
        return res.status(500).json({ message : "Internal Server error !"});
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
            return res.status().json({message:"didn't get any response"})
        }
        return res.status(200).json({message:response.data.message});
           
    }catch(error){
        console.log(error);
        return res.status(500).json({ message : "Internal Server error !"});
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
            return res.status().json({message:"didn't get any response"})
        }
        return res.status(200).json({message: response.data.message});

    }catch(error){
        console.log(error);
        return res.status(500).json({ message : "Internal Server error !"});
    }
}

module.exports={
    toggleEnableDisable,deleteCommmentById,deletePostById,getPostById,deleteUserByUsername,getUserByUsername
}
