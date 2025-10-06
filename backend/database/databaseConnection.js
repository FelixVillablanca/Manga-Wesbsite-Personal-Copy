const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const connectdb = () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log(" ")
        console.log("successfully connected to database...")
    }
    catch (error) {
        // throw new Error `Something went wrong while connecting to database: ${err.message}`
        console.error(`Something went wrong while connecting to database: ${error.message}`)
    }
}

module.exports = connectdb



