
const asyncHandler = require('express-async-handler')
const UserModel = require('../Models/users.model');

const register_user = asyncHandler(async (req, res) => {
    const { usn, pass, email } = req.body;

    const isEmail_Existing = await UserModel.findOne(email);
    if (isEmail_Existing) {
        res.status(403)
        throw new Error("Email is already register.");
    }

    const continueCreate_user = await UserModel.create({
        username : usn,
        password : pass,
        email : email,
        role : 1
    })

    if (continueCreate_user) {
        res.status(201).json({"status" : true, "message" : "successfully registered."});
    }

    


})

module.exports = {
    register_user
}