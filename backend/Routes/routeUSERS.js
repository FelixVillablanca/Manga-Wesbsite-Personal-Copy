
const express = require('express');
const router = express.Router();

//Import controllers
const { register_user } = require('../Controller/userController');

router.post('/api/createUser', register_user);


module.exports = router;


