import React, { useEffect, useState } from "react";
import { getAllOrders } from "../Services/orderService";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrders();
      setOrders(orders);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>All Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <a href={`/orders/${order._id}`}>Order ID: {order._id}</a>
            <p>User ID: {order.userId}</p>
            <p>Total Amount: ${order.totalAmount}</p>
            <p>Status: {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrders;