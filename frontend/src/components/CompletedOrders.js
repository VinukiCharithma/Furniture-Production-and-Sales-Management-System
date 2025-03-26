// src/components/CompletedOrders.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompletedOrders.css'; // Import the CSS file

const CompletedOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/tasks/orders');
                setOrders(response.data.filter(order => order.progress === 100));
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to load completed orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="completed-orders-container">Loading completed orders...</div>;
    }

    if (error) {
        return <div className="completed-orders-container">Error: {error}</div>;
    }

    return (
        <div className="completed-orders-container">
            <h2>Completed Orders</h2>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        <div className="order-details">
                            <p><span className="detail-label">Order ID:</span> {order.orderId}</p>
                            <p><span className="detail-label">Priority:</span> {order.priorityLevel}</p>
                            {order.totalEstimatedTime && (
                                <p><span className="detail-label">Total Estimated Time:</span> {order.totalEstimatedTime} hours</p>
                            )}
                            {order.riskLevel && (
                                <p><span className="detail-label">Risk Level:</span> {order.riskLevel}</p>
                            )}
                            {order.suggestedNewDeadline && (
                                <p><span className="detail-label">Deadline:</span> {new Date(order.suggestedNewDeadline).toLocaleDateString()}</p>
                            )}
                            <p><span className="detail-label">Progress:</span> {order.progress}%</p>
                            
                            {/* You can access any other property of the 'order' object here */}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CompletedOrders;