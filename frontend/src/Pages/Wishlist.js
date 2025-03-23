import React, { useEffect, useState } from "react";
import {
    getWishlist,
    addItemToWishlist,
    deleteWishlistItem,
    moveToCart,
    clearWishlist,
} from "../Services/wishlistService";

const Wishlist = ({ userId }) => {
    const [wishlist, setWishlist] = useState([]);
    const [newProductId, setNewProductId] = useState("");
    const [error, setError] = useState("");

    // Fetch wishlist on component mount
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const wishlistData = await getWishlist(userId);
                setWishlist(wishlistData.items || []);
            } catch (error) {
                setError(error.error || "Failed to fetch wishlist");
            }
        };
        fetchWishlist();
    }, [userId]);

    // Add item to wishlist
    const handleAddItem = async () => {
        if (!newProductId) {
            setError("Product ID is required");
            return;
        }
        try {
            const updatedWishlist = await addItemToWishlist(userId, newProductId);
            setWishlist(updatedWishlist.items);
            setNewProductId("");
            setError("");
        } catch (error) {
            setError(error.error || "Failed to add item to wishlist");
        }
    };

    // Remove item from wishlist
    const handleRemoveItem = async (productId) => {
        try {
            const updatedWishlist = await deleteWishlistItem(userId, productId);
            setWishlist(updatedWishlist.items);
            setError("");
        } catch (error) {
            setError(error.error || "Failed to remove item from wishlist");
        }
    };

    // Move item to cart
    const handleMoveToCart = async (productId) => {
        try {
            await moveToCart(userId, productId);
            const updatedWishlist = await getWishlist(userId);
            setWishlist(updatedWishlist.items);
            setError("");
        } catch (error) {
            setError(error.error || "Failed to move item to cart");
        }
    };

    // Clear wishlist
    const handleClearWishlist = async () => {
        try {
            await clearWishlist(userId);
            setWishlist([]);
            setError("");
        } catch (error) {
            setError(error.error || "Failed to clear wishlist");
        }
    };

    return (
        <div>
            <h2>Your Wishlist</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {wishlist.map((item) => (
                    <li key={item.productId._id}>
                        {item.productId.name} - ${item.productId.price}
                        <button onClick={() => handleRemoveItem(item.productId._id)}>Remove</button>
                        <button onClick={() => handleMoveToCart(item.productId._id)}>Move to Cart</button>
                    </li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    value={newProductId}
                    onChange={(e) => setNewProductId(e.target.value)}
                    placeholder="Enter Product ID"
                />
                <button onClick={handleAddItem}>Add Item</button>
            </div>
            <button onClick={handleClearWishlist}>Clear Wishlist</button>
        </div>
    );
};

export default Wishlist;