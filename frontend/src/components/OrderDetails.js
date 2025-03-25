// src/components/OrderDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [taskStatus, setTaskStatus] = useState({});

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/tasks/orders`);
                const selectedOrder = response.data.find(o => o._id === id);
                setOrder(selectedOrder);

                // Initialize taskStatus with current statuses
                if (selectedOrder && selectedOrder.tasks) {
                    const initialStatus = {};
                    selectedOrder.tasks.forEach(task => {
                        initialStatus[task._id] = task.status;
                    });
                    setTaskStatus(initialStatus);
                }

            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };

        fetchOrder();
    }, [id]);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.put('/tasks/update-task-progress', { taskId, status: newStatus });
            setTaskStatus(prev => ({ ...prev, [taskId]: newStatus }));
            // Optionally, refresh the order data after updating status
            const response = await axios.get(`/tasks/orders`);
            const selectedOrder = response.data.find(o => o._id === id);
            setOrder(selectedOrder);
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Order Details: {order.orderId}</h2>
            <p>Order ID: {order.orderId}</p>
            <p>Priority: {order.priorityLevel}</p>
            <p>Progress: {order.progress}%</p>

            <h3>Tasks:</h3>
            <ul>
                {order.tasks.map(task => (
                    <li key={task._id}>
                        <p>Task Name: {task.taskName}</p>
                        <p>Assigned To: {task.assignedTo?.name || "Not Assigned"}</p>
                        <p>Status: {taskStatus[task._id]}</p>
                        <select value={taskStatus[task._id]} onChange={(e) => handleStatusChange(task._id, e.target.value)}>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderDetails;