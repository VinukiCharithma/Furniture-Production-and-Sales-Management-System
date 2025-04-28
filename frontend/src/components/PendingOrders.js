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
                order.customerApproval === "Pending" && 
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
        const selectedDeadline = new Date(deadline);
        const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        if (!deadline) {
            setDeadlineError('Please select a deadline.');
            return;
        }

        if (selectedDeadline < twoWeeksFromNow) {
            setDeadlineError('Deadline must be at least two weeks from the current time.');
            return;
        }

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
            if (error.response && error.response.data && error.response.data.message) {
                setDeadlineError(error.response.data.message); // Display backend validation errors
            } else {
                setDeadlineError('Failed to generate tasks. Please try again.');
            }
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