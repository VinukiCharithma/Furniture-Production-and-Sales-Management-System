// src/components/CompletedOrders.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div>
            <h2>Completed Orders</h2>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        {order.orderId}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CompletedOrders;