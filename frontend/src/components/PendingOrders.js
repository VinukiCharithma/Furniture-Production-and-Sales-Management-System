// src/components/PendingOrders.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PendingOrders.css'; // Import the CSS file

const PendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [deadline, setDeadline] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [deadlineError, setDeadlineError] = useState('');
    const navigate = useNavigate();

    // Modify your useEffect in PendingOrders.js
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // First sync with order system
                await axios.get('/tasks/sync-orders');
            
                // Then fetch pending orders
                const response = await axios.get('/tasks/orders');
                setOrders(response.data.filter(order => 

                order.originalOrderStatus === "processing"
                ));
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
        }, []);

    const getTwoWeeksFromNow = () => {
        const now = new Date();
        const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        // Format for datetime-local input (YYYY-MM-DDTHH:mm)
        const year = twoWeeks.getFullYear();
        const month = String(twoWeeks.getMonth() + 1).padStart(2, '0');
        const day = String(twoWeeks.getDate()).padStart(2, '0');
        const hours = String(twoWeeks.getHours()).padStart(2, '0');
        const minutes = String(twoWeeks.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleDeadlineChange = (orderId, event) => {
        setSelectedOrderId(orderId);
        setDeadline(event.target.value);
        setDeadlineError(''); // Clear any previous error
    };

    const handleGenerateTasks = async (orderId) => {
        if (!deadline) {
            setDeadlineError('Please select a deadline.');
            return;
        }
    
        const selectedDeadline = new Date(deadline);
        const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    
        if (selectedDeadline < twoWeeksFromNow) {
            setDeadlineError('Deadline must be at least two weeks from now.');
            return;
        }
    
        try {
            console.log('Attempting to generate tasks for order:', orderId);
            
            const response = await axios.post('/tasks/preview-tasks', {
                orderId: orderId,
                deadline: deadline
            });
    
            console.log('API Response:', response.data);
    
            if (!response.data?.tasks) {
                throw new Error("No tasks data in response");
            }
    
            navigate('/taskpreview', {
                state: {
                    tasks: response.data,
                    orderId: orderId,
                    orderDetails: response.data.orderSnapshot || {}
                }
            });
    
        } catch (error) {
            console.error("Error generating tasks:", error);
            setDeadlineError(error.response?.data?.message || 
                           error.message || 
                           "Failed to generate tasks");
        }
    };

    return (
        <div className="pending-orders-container">
            <h2>Pending Orders</h2>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        <strong>Order ID:</strong> {order.orderId}
                        <div>
                            <label>Deadline:</label>
                            <input
                                type="datetime-local"
                                value={selectedOrderId === order.orderId ? deadline : getTwoWeeksFromNow()}
                                onChange={(e) => handleDeadlineChange(order.orderId, e)}
                                min={getTwoWeeksFromNow()} // Set the minimum date
                            />
                            {selectedOrderId === order.orderId && deadlineError && (
                                <p className="error-message">{deadlineError}</p>
                            )}
                        </div>
                        <button onClick={() => handleGenerateTasks(order.orderId)}>Generate Tasks</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PendingOrders;