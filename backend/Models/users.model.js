const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
        username : {
            type : String,
            required : [true, "Please add a username"],
            unique: true,
        },
        password : {
            type : String,
            required : [true, "Please add an password"],
        },
        email : {
            type : String,
            required : [true, "Please add an email"],
            unique : true,
        },
        role : {
            type : Number,
            required : true,
        },
        image : {
            type : String,
            required : false,
        },
        User_Activities_idfk : {
            type : mongoose.Schema.Types.ObjectId, // id from the user_Activities.model.js,
            ref : 'User_Activitie',
            required : false,
        }
    },{
        timestamps : true,
    }

)


const UserModel = mongoose.model("User", UsersSchema);

module.exports = {
    UserModel
}
 