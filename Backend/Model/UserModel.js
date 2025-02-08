const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
    },
    gmail:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    bio:{
        type:String,
        required:true,
    },
    followers:{
        type:Number,
        required:true,
    },
    following:{
        type:Number,
        required:true,
    }
});

module.exports = mongoose.model(
    "UserModel",
    userSchema
)