const mongoose = require('mongoose')

const User_Activities_Schema = mongoose.Schema({
    user_idfk : {
        type : mongoose.Schema.Types.ObjectId, // id of the users
        ref : 'User',
        required : false
    },
    // liked : [{
    //     mangaId : {
    //         type : mongoose.Schema.Types.ObjectId, //this is the id of the specific manga that the users liked 
    //         ref : 'Manga',
    //         required : false,
    //     },
    //     addedAt : {
    //         type : Date,
    //         default : Date.now,
    //     }
    // }],
    // Recent_Viewed : [{
    //     mangaId : {
    //         type : mongoose.Schema.Types.ObjectId, //this is the id of the specific manga that the users recently view 
    //         ref : 'Manga',
    //         required : false,
    //     },
    //     viewedAt : {
    //         type : Date,
    //         default : Date.now,
    //     }
    // }],
    liked : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Manga',
        required : false
    }],
    Recent_Viewed : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Manga',
        required : false,
    }]

})

const User_Activities_Model = mongoose.model("User_Activitie", User_Activities_Schema)

module.exports = {
    User_Activities_Model
}