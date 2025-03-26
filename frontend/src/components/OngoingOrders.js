// src/components/OngoingOrders.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './OngoingOrders.css'; // Import the CSS file

const OngoingOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/tasks/orders');
        setOrders(response.data.filter(order => order.progress >= 0 && order.progress < 100 && order.customerApproval === "Approved"));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="ongoing-orders-container">
      <h2>Ongoing Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            <div className="order-details">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Total Estimated Time:</strong> {order.totalEstimatedTime || 'N/A'} hours</p>
            </div>
            <Link
              to={`/order/${order._id}`}
              className="view-progress-button"
            >
              View Order Progress
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OngoingOrders;