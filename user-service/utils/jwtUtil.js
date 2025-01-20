const jwt = require('jsonwebtoken');
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
    if(!authenticationHeader) return res.status(401).json({ message : "Authorization header is missing !"});
    if (!authenticationHeader.startsWith('Bearer')) return res.status(401).json({ error: 'Invalid Authorization header format' });
    const token = authenticationHeader.split(' ')[1];
    try {
        const payload = verifyToken(token);
        if (!payload) {
            return res.status(402).json({ error: 'Invalid token' });
        }
        req.user = payload;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    generateToken, verifyToken, authenticateUser
}