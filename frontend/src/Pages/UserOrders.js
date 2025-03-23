import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserOrders } from "../Services/orderService";

const UserOrders = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getUserOrders(userId);
      setOrders(orders);
    };
    fetchOrders();
  }, [userId]);

  return (
    <div>
      <h2>Orders for User: {userId}</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <a href={`/orders/${order._id}`}>Order ID: {order._id}</a>
            <p>Total Amount: ${order.totalAmount}</p>
            <p>Status: {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserOrders;