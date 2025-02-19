const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
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
    if(!authenticationHeader) return res.status(StatusCodes.UNAUTHORIZED).json({ message : "Authorization header is missing !"});
    if (!authenticationHeader.startsWith('Bearer')) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid Authorization header format' });
    const token = authenticationHeader.split(' ')[1];
    try {
        const payload = verifyToken(token);
        if (!payload) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token' });
        }
        req.user = {
            payload: payload,
            token: token
        };
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
}

const authenticateIsDisabled=async(req,res,next)=>{
    const id=req.user.payload.email;
    const response=await axios.get(`http://localhost:8080/users/isDisabled/${id}`)
    if(!response){
        return res.status(StatusCodes.NOT_FOUND).json({message:"response is empty while contacting with user service "})
    }
    const isDisabled=response.data.isDisabled;
    if(isDisabled){
        return res.status(StatusCodes.UNAUTHORIZED).json({message:"currently u are disabled"})
    }
    next();
}


module.exports = {
    authenticateUser, verifyToken, authenticateIsDisabled
}