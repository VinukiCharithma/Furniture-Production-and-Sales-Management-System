const mongoose = require("mongoose");
const Wishlist = require("../Model/WishlistModel");
const Product = require("../Model/ProductModel");

// Helper function to validate IDs
const validateIds = (userId, productId = null) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return { valid: false, error: "Invalid user ID" };
    }
    if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
        return { valid: false, error: "Invalid product ID" };
    }
    return { valid: true };
};

// Add Item to Wishlist
const addItemToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        // Validate IDs
        const { valid, error } = validateIds(userId, productId);
        if (!valid) return res.status(400).json({ success: false, error });

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                error: "Product not found" 
            });
        }

        // Check if already in wishlist
        const existingWishlist = await Wishlist.findOne({ 
            userId, 
            "items.productId": productId 
        });
        if (existingWishlist) {
            return res.status(400).json({ 
                success: false,
                error: "Product already in wishlist" 
            });
        }

        // Add to wishlist
        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $addToSet: { items: { productId } } },
            { new: true, upsert: true }
        ).populate("items.productId", "name price image category");

        res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist: updatedWishlist,
            items: updatedWishlist.items
        });
    } catch (error) {
        console.error("Wishlist add error:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
};

// Get User's Wishlist
const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate ID
        const { valid, error } = validateIds(userId);
        if (!valid) return res.status(400).json({ success: false, error });

        const wishlist = await Wishlist.findOne({ userId })
            .populate("items.productId", "name price image category");

        res.status(200).json({
            success: true,
            items: wishlist?.items || [],
            wishlist: wishlist || { items: [] }
        });
    } catch (error) {
        console.error("Wishlist fetch error:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
};

// Remove Item from Wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        
        // Validate IDs
        const { valid, error } = validateIds(userId, productId);
        if (!valid) return res.status(400).json({ success: false, error });

        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true }
        ).populate("items.productId", "name price image");

        if (!updatedWishlist) {
            return res.status(404).json({ 
                success: false,
                error: "Wishlist not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Item removed from wishlist",
            wishlist: updatedWishlist,
            items: updatedWishlist.items
        });
    } catch (error) {
        console.error("Wishlist remove error:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
};

// Move Item to Cart
const moveToCart = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { userId } = req.params;
        const { productId } = req.body;
        
        // Validate IDs
        const { valid, error } = validateIds(userId, productId);
        if (!valid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, error });
        }

        // Remove from wishlist
        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true, session }
        ).populate("items.productId", "name price");

        if (!updatedWishlist) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ 
                success: false,
                error: "Wishlist not found" 
            });
        }

        // Add to cart (implement your cart logic here)
        // await Cart.findOneAndUpdate(
        //     { userId },
        //     { $addToSet: { items: { productId, quantity: 1 } } },
        //     { new: true, upsert: true, session }
        // );

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: "Item moved to cart",
            wishlist: updatedWishlist,
            items: updatedWishlist.items
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Move to cart error:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
};

// Clear Wishlist
const clearWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate ID
        const { valid, error } = validateIds(userId);
        if (!valid) return res.status(400).json({ success: false, error });

        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $set: { items: [] } },
            { new: true }
        );

        if (!updatedWishlist) {
            return res.status(404).json({ 
                success: false,
                error: "Wishlist not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Wishlist cleared",
            wishlist: updatedWishlist,
            items: updatedWishlist.items
        });
    } catch (error) {
        console.error("Clear wishlist error:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
};

module.exports = {
    addItemToWishlist,
    getWishlist,
    removeFromWishlist,
    moveToCart,
    clearWishlist
};