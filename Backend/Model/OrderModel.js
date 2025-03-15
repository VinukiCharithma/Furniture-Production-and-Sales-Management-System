const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true},
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductModel", required: true },
            name: String,
            price: Number,
            quantity: Number,
        },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
    "OrderModel",
    orderSchema
)