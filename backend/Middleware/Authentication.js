
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();


const verifyToken = (req, res, next) => {
    const tokenFrom_User_Header_request = req.headers.authorization?.split(' ')[1];
    if (!tokenFrom_User_Header_request) return res.status(401).json({message : 'No token provided'});

    const WEB_TOKEN = process.env.MangeVerse_WEB_SECRET_TOKEN;
    jwt.verify(tokenFrom_User_Header_request, WEB_TOKEN, (err, decode) => {
        if (err) return res.status(401).json({message : 'Invalid token'})
            req.userCredentialsApproved = decode;
            next();
    })
}

module.exports = verifyToken