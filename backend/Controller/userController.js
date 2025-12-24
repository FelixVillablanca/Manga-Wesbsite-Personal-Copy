
require('dotenv').config(); 
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');

const fs = require('fs')
const path = require('path')

const { UserModel } = require('../Models/users.model');
const { User_Activities_Model } = require('../Models/user_Activities.model')


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
        role : 1
    })

    try {
        if (continueCreate_user) {
            const result = await User_Activities_Model.create({
                user_idfk : continueCreate_user._id
            })

            await result.save();
            if (!result) return res.status(500).json({message : "response from backend 'Error'"})

            if (result) {
                const fkToUserModel_User_Activities_idfk = await UserModel.findById(continueCreate_user._id)
                if (!fkToUserModel_User_Activities_idfk) return res.status(500).json({message : "response from backend 'Error2'"})

                if (fkToUserModel_User_Activities_idfk) {
                    fkToUserModel_User_Activities_idfk.User_Activities_idfk = result._id
                    await fkToUserModel_User_Activities_idfk.save();
                    res.status(200).json({message : "Registered Successfull"})
                }
            }
            
        }
    } catch (error) {
        console.error('backend received an Error: ', error)
    }

    // if (continueCreate_user) {
    //     res.status(201).json({"status" : true, "message" : "successfully registered."});
    // }
})

const login = asyncHandler(async (req, res) => {
    
    const {username, password} = req.body;
    
    const checkUser = await UserModel.findOne({username}).populate('User_Activities_idfk')

    if(!checkUser) {
        res.status(404)
        res.json({"status" : false, "message" : "User is not existing.."})
    }

    const USER_COPY_SECRET_KEY = process.env.MangeVerse_WEB_SECRET_TOKEN; // parsing the Token of the website for users to have copies and be authorized on the system.
    
    // const AuthToken = jwt.sign(checkUser, USER_COPY_SECRET_KEY);
    const activity = checkUser.User_Activities_idfk;

    // For creating token for each users, to have access on the routers and system
    const AuthToken = jwt.sign({
            id: checkUser._id,
            username: checkUser.username,
            email: checkUser.email,
            role: checkUser.role,
            image : checkUser.image,
            User_Activities_idfk: activity?._id, // just the ID
            liked: activity?.liked,             // optional: include liked array
            recentViewed: activity?.Recent_Viewed, 
        },USER_COPY_SECRET_KEY // parsing the token copy from .env, that i created for later verification on token
    );



    password === checkUser.password ? res.status(200).json({"status" : true, "message" : "successsfully login.", "Token" : AuthToken, "userRole" : checkUser.role}) 
    : res.status(401).json({"status": false, "message" : "password does not match."});

})



// ============= Re-issue a new token on every changes in session of the reader/user
const generateUser_Token = (user, activity) => { //reuseable function for parsing the new changes and parsing a new token
    return jwt.sign({
        id : user._id,
        username : user.username,
        email : user.email,
        role : user.role,
        image : user.image,
        User_Activities_idfk : activity?._id,
        Liked : activity?.liked,
        Recent_Viewed : activity?.Recent_Viewed
    }, process.env.MangeVerse_WEB_SECRET_TOKEN)

}


const upload_user_profile_changes_without_File = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const { username, 
            email, 
            new_password, 
            isInclude_Pass, 
            // isInclude_file
        } = req.body;
    const user = await UserModel.findById(user_id);

    if (user) {
        user.username = username,
        user.email = email

        if (isInclude_Pass == 'true') {
            user.password = new_password
        }
        await user.save()
        //for updating the session with the token
        const activity = await User_Activities_Model.findById(user.User_Activities_idfk);
        const newToken = generateUser_Token(user, activity)

        res.status(200).json({ message : "Successfully update the changes..", user, token : newToken})
    }

    if (!user) return res.status(404).json({ message : 'User not found'})

})  

const upload_user_profile_changes_with_File = asyncHandler(async(req, res) => {
    const { user_id } = req.params;
    const {
        username,
        email,
        new_password,
        isInclude_Pass,
        // isInclude_file,
    } = req.body;

    const user = await UserModel.findById(user_id);
    if (user) {
        user.username = username,
        user.email = email

        if (isInclude_Pass == 'true') {
            user.password = new_password
        }

        if (req.file && req.file.filename) { //req.file if single, req.files if many files
            const imageOld = user?.image;

            console.log('check image: ', imageOld)
            if (imageOld && imageOld.startsWith('/User_Image_Dir/')) {
                const oldImagePath = path.join(__dirname, '..', 'User', 'ProfileUploads', imageOld.replace('/User_Image_Dir/', '')) // directly checking the path to Controller/User/ProfileUploads/1763210836671-2_0.jpg

                // console.log('__dirname:', __dirname);
                console.log('Created path:', oldImagePath);

                // console.log('Filename to delete:', imageOld.replace('/User_Image_Dir/', ''));

                // console.log('oldImagePath, ', oldImagePath)
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (err) => {
                        if(err) console.error('Error deleting old image: ', err)
                        else console.log('Deleted old image: ', oldImagePath)
                    })
                }
            }

            user.image = `/User_Image_Dir/${req.file.filename}`;
        }

        // if (isInclude_file == 'true') {
        //     const User_Uploaded_image = `/User_Image_Dir/${req.file?.filename}`
        //     if (User_Uploaded_image) {
        //         user.image = User_Uploaded_image
        //     }
        // }
        await user.save();
        const activity = await User_Activities_Model.findById(user.User_Activities_idfk);
        const newToken = generateUser_Token(user, activity)

        res.status(200).json({ message : "Successfully update changes!", user, token : newToken})
    } else {
        res.status(404).json({ message : "No User Found"})
    }

})

const get_User_Updated_Session = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    console.log('User Id: ', user_id)
    const user = await UserModel.findById(req.params.user_id);
    if (!user) return res.status(404).json({ message : 'User Not found!'})
    
    const activity = await User_Activities_Model.findById(user.User_Activities_idfk).populate('liked').populate('Recent_Viewed');

    const newToken = generateUser_Token(user, activity)
    console.log('Updated Session: ', newToken)
    
    
    console.log('Sending response:', { updated_session_token: newToken });

    res.status(201).json({ updated_session_token: newToken })
})


module.exports = {
    register_user,
    login,
    upload_user_profile_changes_without_File,
    upload_user_profile_changes_with_File,
    get_User_Updated_Session
    // get_Updated_User
}
