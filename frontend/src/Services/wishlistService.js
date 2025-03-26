import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/wishlists';

// Add Item to Wishlist
export const addItemToWishlist = async (userId, productId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/`, { userId, productId });
        if (response.data.success) {
            return {
                success: true,
                wishlist: response.data.wishlist,
                message: response.data.message
            };
        }
        throw new Error(response.data.error || "Failed to add to wishlist");
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || "Failed to add to wishlist"
        };
    }
};

// Get Wishlist
export const getWishlist = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${userId}`);
        if (response.data.success) {
            return {
                success: true,
                items: response.data.items || [],
                wishlist: response.data.wishlist || { items: [] }
            };
        }
        throw new Error(response.data.error || "Failed to fetch wishlist");
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || "Failed to fetch wishlist",
            items: []
        };
    }
};

// Remove Item from Wishlist
export const removeFromWishlist = async (userId, productId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${userId}/${productId}`);
        if (response.data.success) {
            return {
                success: true,
                wishlist: response.data.wishlist,
                message: response.data.message
            };
        }
        throw new Error(response.data.error || "Failed to remove from wishlist");
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || "Failed to remove from wishlist"
        };
    }
};

// Move Item to Cart
export const moveToCart = async (userId, productId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/move-to-cart/${userId}`, { productId });
        if (response.data.success) {
            return {
                success: true,
                wishlist: response.data.wishlist,
                message: response.data.message
            };
        }
        throw new Error(response.data.error || "Failed to move to cart");
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || "Failed to move to cart"
        };
    }
};

// Clear Wishlist
export const clearWishlist = async (userId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${userId}/clear`);
        if (response.data.success) {
            return {
                success: true,
                wishlist: response.data.wishlist,
                message: response.data.message
            };
        }
        throw new Error(response.data.error || "Failed to clear wishlist");
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || "Failed to clear wishlist"
        };
    }
};