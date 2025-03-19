const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    orderId: { type: String, required: true },
    priorityLevel: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    tasks: [{
        taskName: String,
        assignedTo: { type: Schema.Types.ObjectId, ref: "EmpModel" },
        status: { type: String, default: "Pending" },
        estimatedTime: Number,
        dueDate: Date, // Added due date for tracking delays
    }],
    totalEstimatedTime: Number,
    riskLevel: { type: String, default: "Low" },
    customerApproval: { type: String, enum: ["Pending", "Approved", "Declined"], default: "Pending" },
    progress: { type: Number, default: 0 }, // Track order progress in %
    dispatchStatus: { type: Boolean, default: false } // Mark when ready for dispatch
});

module.exports = mongoose.model("TaskModel", taskSchema);
