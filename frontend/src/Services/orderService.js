import axios from "axios";

const API_URL = "http://localhost:5000/orders"; // Replace with your backend URL

// Create Order
export const createOrder = async (orderData) => {
  const response = await axios.post(API_URL, orderData);
  return response.data;
};

// Get Order by ID
export const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_URL}/${orderId}`);
  return response.data;
};

// Get Orders by User ID
export const getUserOrders = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

// Update Order
export const updateOrder = async (orderId, orderData) => {
  const response = await axios.put(`${API_URL}/${orderId}`, orderData);
  return response.data;
};

// Delete Order
export const deleteOrder = async (orderId) => {
  const response = await axios.delete(`${API_URL}/${orderId}`);
  return response.data;
};

// Get All Orders (Admin)
export const getAllOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Update Order Status
export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.put(`${API_URL}/status/${orderId}`, { status });
  return response.data;
};

// Generate Order Reports
export const generateOrderReports = async () => {
  const response = await axios.get(`${API_URL}/reports/sales`);
  return response.data;
};