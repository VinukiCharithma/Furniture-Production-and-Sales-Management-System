const mongoose = require("mongoose");
const Wishlist = require("../Model/WishlistModel");
const Product = require("../Model/ProductModel");

// Add Item to Wishlist (WL1)
const addItemToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Validate if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Add item to wishlist atomically
        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { userId, "items.productId": { $ne: productId } }, // Ensure item doesn't already exist
            { $push: { items: { productId } } }, // Add new item
            { new: true, upsert: true } // Create wishlist if it doesn't exist
        );

        res.json(updatedWishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Wishlist (WL2) → Auto-populate product details
const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid User ID" });
        }

        const wishlist = await Wishlist.findOne({ userId }).populate("items.productId", "name price");
        if (!wishlist) {
            return res.status(404).json({ error: "Wishlist not found" });
        }

        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Wishlist (WL3)
const updateWishlist = async (req, res) => {
    try {
        const { items } = req.body;
        const { userId } = req.params;

        // Validate items array
        if (!Array.isArray(items)) {
            return res.status(400).json({ error: "Items must be an array" });
        }

        // Update wishlist atomically
        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $set: { items } }, // Replace the entire items array
            { new: true }
        );

        if (!updatedWishlist) {
            return res.status(404).json({ error: "Wishlist not found" });
        }

        res.json(updatedWishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Wishlist Item (WL4)
const deleteWishlistItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Remove item from wishlist atomically
        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } }, // Remove the item
            { new: true }
        );

        if (!updatedWishlist) {
            return res.status(404).json({ error: "Wishlist not found" });
        }

        res.json(updatedWishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Move Wishlist to Cart (WL5)
const moveToCart = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId } = req.params;
        const { productId } = req.body;

        // Remove item from wishlist atomically
        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } }, // Remove the item
            { new: true, session }
        );

        if (!updatedWishlist) {
            throw new Error("Wishlist not found");
        }

        // Add item to cart (example logic)
        // await Cart.findOneAndUpdate(
        //   { userId },
        //   { $push: { items: { productId } } },
        //   { new: true, session }
        // );

        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Item moved to cart", wishlist: updatedWishlist });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
};

// Clear Wishlist (WL6)
const clearWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        // Clear wishlist atomically
        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $set: { items: [] } }, // Clear the items array
            { new: true }
        );

        if (!updatedWishlist) {
            return res.status(404).json({ error: "Wishlist not found" });
        }

        res.json({ message: "Wishlist cleared successfully", wishlist: updatedWishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addItemToWishlist,
    getWishlist,
    updateWishlist,
    deleteWishlistItem,
    moveToCart,
    clearWishlist,
};