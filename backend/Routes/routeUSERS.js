
const express = require('express');
const router = express.Router();


//Import controllers
const { register_user, login} = require('../Controller/userController');

//Import Authentication Middleware for authorization of routes
// const verifyToken = require('./Middleware/Authentication');


router.post('/createUser', register_user);
router.post('/login', login)
// router.post('/login', verifyToken, login) //example of the token middleware i created

//routers with verifyToken after logging in


module.exports = router;


