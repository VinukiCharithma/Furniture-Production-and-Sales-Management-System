// src/components/OrderDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './OrderDetails.css'; // Import the CSS file

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [taskStatus, setTaskStatus] = useState({});
    const [isStatusChanged, setIsStatusChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            setError(null);
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
                setError("Failed to load order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]); // Fetch order again if the ID in the URL changes

    useEffect(() => {
        if (order && order.tasks) {
            const changed = order.tasks.some(task => task.status !== taskStatus[task._id]);
            setIsStatusChanged(changed);
        }
    }, [taskStatus, order]);

    const handleStatusChange = (taskId, newStatus) => {
        const currentTask = order?.tasks?.find(task => task._id === taskId);
        const currentStatus = taskStatus[taskId];

        if (currentStatus === 'Completed') {
            return;
        }

        if (currentStatus === 'In Progress' && newStatus === 'Pending') {
            return;
        }

        setTaskStatus(prev => ({ ...prev, [taskId]: newStatus }));
    };

    const applyStatusChanges = async () => {
        setLoading(true);
        setError(null);
        try {
            const updatesToSend = Object.keys(taskStatus)
                .filter(taskId => {
                    const originalTask = order?.tasks?.find(task => task._id === taskId);
                    return originalTask && originalTask.status !== taskStatus[taskId];
                });

            console.log('updatesToSend array:', updatesToSend); // <--- ADD THIS LINE

            if (updatesToSend.length > 0) {
                for (const taskId of updatesToSend) {
                    const newStatus = taskStatus[taskId];
                    try {
                        const response = await axios.put('/tasks/update-task-progress', { taskId: taskId, status: newStatus });
                        console.log(`Updated task ${taskId}:`, response?.data);
                    } catch (updateError) {
                        console.error(`Error updating task ${taskId}:`, updateError);
                        setError("Failed to update some or all task statuses.");
                        setLoading(false);
                        return; // Exit if any individual update fails
                    }
                }

                // Re-fetch and update state after attempting all updates
                const fetchResponse = await axios.get(`/tasks/orders`);
                const updatedOrder = fetchResponse.data.find(o => o._id === id);
                setOrder(updatedOrder);
                const newStatusMap = {};
                updatedOrder?.tasks?.forEach(task => {
                    newStatusMap[task._id] = task.status;
                });
                setTaskStatus(newStatusMap);
                setIsStatusChanged(false);
            } else {
                alert("No changes to apply.");
            }
        } catch (error) {
            console.error("Error in applyStatusChanges:", error);
            setError("Failed to update task statuses.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="order-details-container">Loading...</div>;
    }

    if (error) {
        return <div className="order-details-container">Error: {error}</div>;
    }

    if (!order) {
        return <div className="order-details-container">Order not found.</div>;
    }

    return (
        <div className="order-details-container">
            <h2>Order Details: {order.orderId}</h2>
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Priority:</strong> {order.priorityLevel}</p>
            <p><strong>Progress:</strong> {order.progress}%</p>

            <h3>Tasks:</h3>
            <ul>
                {order.tasks?.map(task => (
                    <li key={task._id}>
                        <p><strong>Task Name:</strong> {task.taskName}</p>
                        <p><strong>Assigned To:</strong> {task.assignedTo?.name || "Not Assigned"}</p>
                        <p><strong>Status:</strong> {taskStatus[task._id]}</p>
                        <select
                            value={taskStatus[task._id]}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            disabled={task.status === 'Completed'}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </li>
                ))}
            </ul>

            <div className="actions">
                <button onClick={applyStatusChanges} disabled={!isStatusChanged || loading}>
                    {loading ? 'Saving...' : 'Apply Changes'}
                </button>
            </div>
        </div>
    );
};

export default OrderDetails;