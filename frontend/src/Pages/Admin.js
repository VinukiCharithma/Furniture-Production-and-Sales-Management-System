import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../Services/orderService";

const Admin = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrders();
      setOrders(orders);
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    const updatedOrders = orders.map((order) =>
      order._id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {orders.map((order) => (
        <div key={order._id}>
          <h3>Order ID: {order._id}</h3>
          <p>User: {order.userId.name}</p>
          <p>Total Amount: ${order.totalAmount}</p>
          <p>Status: {order.status}</p>
          <select
            value={order.status}
            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default Admin;