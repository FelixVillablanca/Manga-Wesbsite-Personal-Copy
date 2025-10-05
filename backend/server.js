
const dotenv = require("dotenv").config();

const express = require('express');


const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json())

app.use('/user', require('./Routes/routeUSERS'));



app.listen(PORT, () => {
    console.log(`backend listening on port: ${PORT}`)
})

