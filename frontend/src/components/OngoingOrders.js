// src/components/OngoingOrders.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OngoingOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/tasks/orders');
                setOrders(response.data.filter(order => order.progress > 0 && order.progress < 100));
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h2>Ongoing Orders</h2>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        <Link to={`/order/${order._id}`}>{order.orderId}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OngoingOrders;