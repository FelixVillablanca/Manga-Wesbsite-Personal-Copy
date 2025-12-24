
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
        Published : { 
            type : String,
            require : true,
            default : "Unpublished"
        },
        Author : {  
            type : String,
            require : false,
            default : "Anonymous Author"
        },
        UserInteracted : [{ // For tracking the number of viewers of that specific manga
            type : mongoose.Schema.Types.ObjectId, // An array of the id of the users who viewed to this specific manga
            required : false,
        }],
        UsersLiked : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : false,
        }]

    }, {
        timestamps : true
    }
)


const MangaModel = mongoose.model("Manga", MangaSchema)
module.exports = {
    MangaModel
}