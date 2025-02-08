const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itinerarySchema = new Schema ({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
        required:true,
    },
    tripName:{
        type:String,
        required:true,
    },
    destination:{
        type:[String],
        required:true,
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    totalBudget:{
        type:Number,
        default: 0,
    }
}, {timestamps:true});

module.exports = mongoose.model(
    "ItineraryModel",
    itinerarySchema
)