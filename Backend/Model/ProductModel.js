const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  material: { type: String, required: true },
  availability: { type: Boolean, default: true },
  stockQuantity: { type: Number, required: true, default: 0 }, // Add this field
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProductModel", productSchema);
