import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/cart'; // Adjust the URL based on your backend configuration

// Get Cart
export const getCart = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Add Item to Cart
export const addItemToCart = async (userId, productId, quantity) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/`, { userId, productId, quantity });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Remove Item from Cart
export const removeFromCart = async (userId, productId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${userId}/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Update Cart Item Quantity
export const updateCartItemQuantity = async (userId, productId, quantity) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${userId}/${productId}`, { quantity });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Clear Cart
export const clearCart = async (userId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${userId}/clear`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};