
const express = require('express');

const router = express.Router();

router.post('/registerUser', (req, res) => {
    const { usn, pass, email } = req.body;
})


module.exports = router;


