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
        }
    },{
        timestamps : true,
    }

)


const UserModel = mongoose.model("User", UsersSchema);

module.exports = {
    UserModel
}
 