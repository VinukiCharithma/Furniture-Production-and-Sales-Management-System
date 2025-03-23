import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/wishlists'; // Adjust based on your backend URL

// Add Item to Wishlist
export const addItemToWishlist = async (userId, productId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/`, { userId, productId });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to add item to wishlist" };
    }
};

// Get Wishlist
export const getWishlist = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to fetch wishlist" };
    }
};

// Update Wishlist
export const updateWishlist = async (userId, items) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${userId}`, { items });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to update wishlist" };
    }
};

// Delete Wishlist Item
export const deleteWishlistItem = async (userId, productId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${userId}/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to delete item from wishlist" };
    }
};

// Move Wishlist Item to Cart
export const moveToCart = async (userId, productId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/move-to-cart/${userId}`, { productId });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to move item to cart" };
    }
};

// Clear Wishlist
export const clearWishlist = async (userId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${userId}/clear`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to clear wishlist" };
    }
};