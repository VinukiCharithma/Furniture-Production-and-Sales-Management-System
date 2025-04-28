const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "OrderModel",
        required: true 
    },
    originalOrderStatus: { 
        type: String, 
        default: "processing",
        enum: ["processing", "shipped", "delivered", "cancelled"]
    },
    priorityLevel: { 
        type: String, 
        enum: ["High", "Medium", "Low"], 
        default: "Medium" 
    },
    tasks: [{
        taskName: { type: String, required: true },
        description: String,
        assignedTo: { 
            type: Schema.Types.ObjectId, 
            ref: "EmpModel",
            default: null
        },
        status: { 
            type: String, 
            default: "Pending",
            enum: ["Pending", "In Progress", "Completed"]
        },
        estimatedTime: { 
            type: Number, 
            required: true,
            min: 0.5  // Minimum 0.5 hours per task
        },
        dueDate: {
            type: Date,
            required: true
        },
        materialsRequired: [{
            name: String,
            quantity: Number
        }],
        dependencies: [{
            type: Schema.Types.ObjectId,
            ref: "TaskModel"
        }]
    }],
    totalEstimatedTime: {
        type: Number,
        required: true
    },
    riskLevel: { 
        type: String, 
        default: "Low",
        enum: ["Low", "Medium", "High"] 
    },
    customerApproval: { 
        type: String, 
        enum: ["Pending", "Approved", "Declined"], 
        default: "Pending" 
    },
    progress: { 
        type: Number, 
        default: 0,
        min: 0,
        max: 100 
    },
    dispatchStatus: { 
        type: Boolean, 
        default: false 
    },
    orderDetails: {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "UserModel",
            required: true
        },
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "ProductModel"
            },
            name: String,
            quantity: Number,
            price: Number
        }],
        shippingAddress: {
            address: String,
            city: String,
            postalCode: String
        },
        totalPrice: Number
    },
    productionStartDate: {
        type: Date,
        default: null
    },
    productionEndDate: {
        type: Date,
        default: null
    },
    notes: [{
        text: String,
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "EmpModel"
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { 
    timestamps: true,
    collection: 'taskmodels' 
});

// Add index for better query performance
taskSchema.index({ orderId: 1 });
taskSchema.index({ "tasks.status": 1 });
taskSchema.index({ "tasks.dueDate": 1 });

module.exports = mongoose.model("TaskModel", taskSchema, 'taskmodels');