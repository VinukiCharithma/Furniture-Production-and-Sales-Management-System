// src/components/PendingOrders.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [requirements, setRequirements] = useState('');
    const [deadline, setDeadline] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/tasks/orders');
                setOrders(response.data.filter(order => order.customerApproval === "Pending"));
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const handleGenerateTasks = async () => {
        try {
            const response = await axios.post('/tasks/preview-tasks', { requirements, deadline });
            navigate('/taskpreview', { state: { tasks: response.data } });
        } catch (error) {
            console.error("Error generating tasks:", error);
        }
    };

    return (
        <div>
            <h2>Pending Orders</h2>
            <ul>
                {orders.map(order => (
                    <li key={order._id} onClick={() => setSelectedOrder(order)}>
                        {order.orderId}
                    </li>
                ))}
            </ul>
            {selectedOrder && (
                <div>
                    <h3>Order Details: {selectedOrder.orderId}</h3>
                    <p>Order ID: {selectedOrder.orderId}</p>
                    <p>Priority: {selectedOrder.priorityLevel}</p>
                    <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Requirements" />
                    <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                    <button onClick={handleGenerateTasks}>Generate Tasks</button>
                </div>
            )}
        </div>
    );
};

export default PendingOrders;