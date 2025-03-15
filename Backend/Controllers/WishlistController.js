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

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    // Check if product is already in the wishlist
    const itemExists = wishlist.items.some((item) =>
      item.productId.equals(productId)
    );
    if (itemExists) {
      return res.status(400).json({ error: "Item already in wishlist" });
    }

    wishlist.items.push({ productId });
    await wishlist.save();

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Wishlist (WL2) → Auto-populate product details
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      userId: req.params.userId,
    }).populate("items.productId", "name price"); // Fetch product details

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addItemToWishlist,
  getWishlist,
};

// Update Wishlist (WL3)
const updateWishlist = async (req, res) => {
  try {
    const { items } = req.body;
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { userId: req.params.userId },
      { items },
      { new: true }
    );
    res.json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Wishlist Item (WL4)
const deleteWishlistItem = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });
    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Move Wishlist to Cart (WL5)
const moveToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });

    const item = wishlist.items.find(
      (item) => item.productId.toString() === productId
    );

    if (item) {
      // Add item to Cart logic here (TBD)
      wishlist.items = wishlist.items.filter(
        (item) => item.productId.toString() !== productId
      );
      await wishlist.save();
    }
    res.json({ message: "Item moved to cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear Wishlist (WL6)
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    // Clear the items array properly
    wishlist.items = [];
    await wishlist.markModified("items"); // Ensure Mongoose detects the change
    await wishlist.save();

    res.json({ message: "Wishlist cleared successfully", wishlist });
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
