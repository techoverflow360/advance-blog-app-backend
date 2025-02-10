const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes')
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
        req.user ={
          payload: payload,
          token: token
        }
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
}

const adminAuthenticate=async(req,res,next)=>{
    const isAdmin=req.user.payload.isAdmin;
    if(isAdmin==true){
        next();
    }
    return res.status(StatusCodes.FORBIDDEN).json({message:'You are not an admin'});
}

module.exports = {
  verifyToken, authenticateUser,adminAuthenticate
}
