// src/components/PendingOrders.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [deadline, setDeadline] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
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

    const handleDeadlineChange = (orderId, event) => {
        setSelectedOrderId(orderId);
        setDeadline(event.target.value);
    };

    const handleGenerateTasks = async (orderId) => {
        console.log('Generate Tasks clicked for:', orderId);
        const orderToProcess = orders.find(order => order.orderId === orderId);
        if (!orderToProcess) {
            console.error(`Order with ID ${orderId} not found.`);
            return;
        }
        console.log('Order to process:', orderToProcess);

        try {
            console.log('Sending data:', { orderId: orderId, orderData: orderToProcess, deadline: deadline });
            const response = await axios.post('/tasks/preview-tasks', {
                orderId: orderId,
                orderData: orderToProcess,
                deadline: deadline,
            });
            console.log('Response from /preview-tasks:', response.data);
            console.log('Response data before navigation:', response.data); // ADDED LOG
            navigate('/taskpreview', { state: { tasks: response.data, orderId: orderId } });
            console.log('Navigated to /taskpreview');
        } catch (error) {
            console.error("Error generating tasks:", error);
        }
    };

    return (
        <div>
            <h2>Pending Orders</h2>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        <strong>Order ID:</strong> {order.orderId}
                        <div>
                            <label>Deadline:</label>
                            <input
                                type="datetime-local"
                                value={selectedOrderId === order.orderId ? deadline : ''}
                                onChange={(e) => handleDeadlineChange(order.orderId, e)}
                            />
                        </div>
                        <button onClick={() => handleGenerateTasks(order.orderId)}>Generate Tasks</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PendingOrders;