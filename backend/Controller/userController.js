
const dotenv = require('dotenv').config(); 
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');

const { UserModel } = require('../Models/users.model');


const register_user = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    const isEmail_Existing = await UserModel.findOne({ email });
    if (isEmail_Existing) {
        res.status(403)
        throw new Error("Email is already register.");
    }

    const continueCreate_user = await UserModel.create({
        username : username,
        password : password,
        email : email,
        role : 2
    })

    if (continueCreate_user) {
        res.status(201).json({"status" : true, "message" : "successfully registered."});
    }
})

const login = asyncHandler(async (req, res) => {
    
    const {username, password} = req.body;
    
    const checkUser = await UserModel.findOne({username})

    if(!checkUser) {
        res.status(404)
        res.json({"status" : false, "message" : "User is not existing.."})
    }

    const USER_COPY_SECRET_KEY = process.env.MangeVerse_WEB_SECRET_TOKEN; // parsing the Token of the website for users to have copies and be authorized on the system.
    
    //For creating token for each users, to have access on the routers and system
    const AuthToken = jwt.sign({
            id: checkUser._id,
            username: checkUser.username,
            email: checkUser.email,
            role: checkUser.role,
        },USER_COPY_SECRET_KEY // parsing the token copy from .env, that i created for later verification on token
    );



    password === checkUser.password ? res.status(200).json({"status" : true, "message" : "successsfully login.", "Token" : AuthToken, "userRole" : checkUser.role}) 
    : res.status(401).json({"status": false, "message" : "password does not match."});

})


module.exports = {
    register_user,
    login
}
