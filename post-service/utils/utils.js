const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (token) => {
    try {
        const decodedPayload = jwt.verify(token, process.env.SECRET);
        return decodedPayload;        
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            console.error('JWT Verification Error:', error.message);
          if (error.message.includes('expired')) {
            console.error('Token has expired. Please re-authenticate.');
          } else if (error.message.includes('invalid signature')) {
            console.error('Invalid JWT signature. Potential tampering detected.');
          }
        } else {
          console.error('Unexpected Error:', error);
        } 
    } 
}

const authenticateUser = (req, res, next) => {
    const authenticationHeader = req.headers['authorization'];
    if(!authenticationHeader) return res.status(401).json({ message : "Authorization header is missing !"});
    if (!authenticationHeader.startsWith('Bearer')) return res.status(401).json({ error: 'Invalid Authorization header format' });
    const token = authenticationHeader.split(' ')[1];
    try {
        const payload = verifyToken(token);
        if (!payload) {
            return res.status(402).json({ error: 'Invalid token' });
        }
        req.user = {
            payload: payload,
            token: token
        };
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const authenticateIsDisabled=async(req,res,next)=>{
    const id=req.user.payload.email;
    const response=await axios.get(`http://localhost:8080/users/isDisabled/${id}`)
    if(!response){
        return res.status(400).json({message:"response is empty while contacting with user service "})
    }
    const isDisabled=response.data.isDisabled;
    if(isDisabled){
        return res.status(401).json({message:"currently u are disabled"})
    }
    next();
}

module.exports = {
    authenticateUser, verifyToken,authenticateIsDisabled
}