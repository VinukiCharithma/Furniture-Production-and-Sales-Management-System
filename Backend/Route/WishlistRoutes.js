const express = require("express");
const router = express.Router();

const WishlistController = require("../Controllers/WishlistController");

router.post("/", WishlistController.addItemToWishlist); // WL1
router.get("/:userId", WishlistController.getWishlist); // WL2
router.put("/:userId", WishlistController.updateWishlist); // WL3
router.delete("/:userId/clear", WishlistController.clearWishlist); // WL6
router.delete("/:userId/:productId", WishlistController.deleteWishlistItem); // WL4
router.post("/move-to-cart/:userId", WishlistController.moveToCart); // WL5

module.exports = router;