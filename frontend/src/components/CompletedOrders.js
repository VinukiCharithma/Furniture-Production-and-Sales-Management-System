// src/components/CompletedOrders.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompletedOrders.css'; // Import the CSS file

const CompletedOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/tasks/orders');
                setOrders(response.data.filter(order => order.progress === 100));
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="completed-orders-container">
            <h2>Completed Orders</h2>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        <span className="order-id">Order ID:</span> {order.orderId}
                        {/* You can add more order details here using appropriate CSS classes */}
                        {/* <div className="order-details">
                            <p className="other-info">Priority: {order.priorityLevel}</p>
                            <p className="other-info">...</p>
                        </div> */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CompletedOrders;