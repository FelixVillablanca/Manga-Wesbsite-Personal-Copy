
const dotenv = require("dotenv").config();
const express = require('express');

const connectdb = require('./database/databaseConnection');
connectdb();

//Felix - create an app
const app = express();

//Felix - setUp middleware
const errorStatusChecker = require('./Middleware/errorStatusHandler');

const port = process.env.PORT || 5001;

app.use(express.json())
app.use('/api', require('./Routes/routeUSERS'));
app.use(errorStatusChecker)



app.listen(port, () => {
    console.log(" ")
    console.log(`backend listening on port: ${port}`)
    console.log(`full path: https://localhost:${port}`)
    console.log(`path starting interaction to backend: https://localhost:${port}/api`)
})

