const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductModel", required: true }
      },
    ],
});

module.exports = mongoose.model("WishlistModel", wishlistSchema);
