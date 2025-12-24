
const mongoose = require('mongoose')

const LatestChaptersSchema = mongoose.Schema({
    LatestChapters : [{
        type : mongoose.Schema.Types.ObjectId, // id of new Chapters
        ref : 'Chapter',
        required : false,
    }]
})


const LatestChapters_Model = mongoose.model("Latest_Chapter", LatestChaptersSchema)

module.exports = {
    LatestChapters_Model
}