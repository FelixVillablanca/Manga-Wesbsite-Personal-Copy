
const dotenv = require("dotenv").config();
const express = require('express');
const cors = require('cors') //allow cross origin
const path = require('path');
const connectdb = require('./database/databaseConnection');
connectdb();

//Felix - create an app
const app = express();
app.use(cors())

//Felix - setUp middleware
const errorStatusChecker = require('./Middleware/errorStatusHandler');

const port = process.env.PORT || 5001;

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Manga', 'upload_chapter_images'))); //files that has name /uploads can access images on Manga/upload_pre_images_manga directory
app.use('/api', require('./Routes/Highway'));
app.use(errorStatusChecker);


app.listen(port, () => {
    console.log(" ")
    console.log(`backend listening on port: ${port}`)
    console.log(`full path: http://localhost:${port}`)
    console.log(`path starting interaction to backend: http://localhost:${port}/api`)
})
