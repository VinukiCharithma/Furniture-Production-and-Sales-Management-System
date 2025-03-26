const express = require("express");
const router = express.Router();
const WishlistController = require("../Controllers/WishlistController");

// Add item to wishlist
router.post("/", WishlistController.addItemToWishlist);

// Get user's wishlist
router.get("/:userId", WishlistController.getWishlist);

// Remove item from wishlist
router.delete("/:userId/:productId", WishlistController.removeFromWishlist);

// Move item to cart
router.post("/move-to-cart/:userId", WishlistController.moveToCart);

// Clear wishlist
router.delete("/clear/:userId", WishlistController.clearWishlist);

module.exports = router;