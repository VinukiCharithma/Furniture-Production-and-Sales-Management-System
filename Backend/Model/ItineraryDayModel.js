const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItineraryDaySchema = new Schema ({
    itineraryId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"ItineraryModel",
        required:true,
    },
    day: {
        type:Number,
        required:true,
    },
    activities: [
        {
            time: {
                type:String,
                required:true,
            },
            description: {
                type:String,
                required:true,
            },
            cost: {
                type:Number,
                default:0,
            }
        }
    ]
});

module.exports = mongoose.model(
    "ItineraryDayModel",
    ItineraryDaySchema
)