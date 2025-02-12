const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../model/Blogger');
require('dotenv').config();


const generateToken = (payload) => {
    if(!payload) return false;
    const token = jwt.sign(payload, process.env.SECRET);
    return token;
}

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
        }
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
}

const adminAuthenticate = async(req, res, next) => {
    const isAdmin = req.user.payload.isAdmin;
    if(isAdmin === false){
        return res.status(StatusCodes.UNAUTHORIZED).json({message:'You are not an admin'});
    }
    next();
}

const authenticateIsDisabled = async (req, res, next) => {
    try {
        const userName = req.user.payload.username;
        const user = await User.findOne({where:{username:userName}});
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({ message : "User not found !" });
        if(user.isDisabled) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "User is currently disabled !" });
        } 
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    generateToken, verifyToken, authenticateUser,adminAuthenticate, authenticateIsDisabled
}