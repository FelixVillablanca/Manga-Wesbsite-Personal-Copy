
const mongoose = require('mongoose')


const ChaptersSchema = mongoose.Schema({
        manga_idfk : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Manga',
            required : true
        },
        images : [{
            type : String,
            required : true
        }],
    }, {
        timestamps : true,
    }
)

const ChaptersModel = mongoose.model("Chapter", ChaptersSchema);

module.exports = {
    ChaptersModel   
}
