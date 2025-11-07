
const mongoose = require('mongoose')


const MangaSchema = mongoose.Schema({
        title : {
            type : String,
            require : true
        },
        Genre : {
            type : String,
            require : true
        },
        // Images : {
        //     type : Array,
        //     require : true
        // },
        Chapters_idfk : [{
            type : mongoose.Schema.Types.ObjectId, //later for use, const mangaWithChapters = await MangaModel.findById(id).populate('Chapters_idfk');
            ref : 'Chapter',
            required : true,
            
        }],
        Status : {
            type : String,
            require : true
        },
        Published : { // new 
            type : String,
            require : true,
            default : "Unpublished"
        },
        Author : {  // new
            type : String,
            require : false,
            default : "Anonymous Author"
        },
    }, {
        timestamps : true
    }
)


const MangaModel = mongoose.model("Manga", MangaSchema)
module.exports = {
    MangaModel
}