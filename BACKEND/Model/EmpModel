const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const empSchema = new Schema({
    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    phone:{type:String, required:true},
    job:{type:String, required:true},
    status:{type:String, required:true},
    username:{type:String, required:true},
    password:{type:String, required:true},
});

module.exports = mongoose.model(
    "EmpModel", //file name
    empSchema //function name
)