const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    orderId: { type: String, required: true },
    tasks: [{
        taskName: String,
        assignedTo: { type: Schema.Types.ObjectId, ref: "EmpModel" },
        status: { type: String, default: "Pending" },
        estimatedTime: Number,
    }],
    totalEstimatedTime: Number,
    riskLevel: { type: String, default: "Low" },
    customerApproval: { type: String, enum: ["Pending", "Approved", "Declined"], default: "Pending" }
});

module.exports = mongoose.model("TaskModel", taskSchema);