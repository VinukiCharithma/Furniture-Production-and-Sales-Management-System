// src/services/orderService.js

import axios from 'axios';
import { getAuthHeader } from './authService';

const API_URL = 'http://localhost:5000/orders';

export const createOrder = async (orderData) => {
    const response = await axios.post(API_URL, orderData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await axios.get(`${API_URL}/${orderId}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getUserOrders = async (userId) => {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await axios.put(`${API_URL}/${orderId}/cancel`, {}, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const startProcessingOrder = async (orderId) => {
    const response = await axios.put(`${API_URL}/${orderId}/start-processing`, {}, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const completeOrderItem = async (orderId, itemId) => {
    const response = await axios.put(`${API_URL}/${orderId}/complete-item/${itemId}`, {}, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const shipOrder = async (orderId, trackingNumber) => {
    const response = await axios.put(`${API_URL}/${orderId}/ship`, { trackingNumber }, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const deliverOrder = async (orderId) => {
    const response = await axios.put(`${API_URL}/${orderId}/deliver`, {}, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getAllOrders = async (filters = {}) => {
    const response = await axios.get(API_URL, {
        headers: getAuthHeader(),
        params: filters
    });
    return response.data;
};

export const getOrderReports = async () => {
    const response = await axios.get(`${API_URL}/reports/sales`, {
        headers: getAuthHeader()
    });
    return response.data;
};