// src/components/Alerts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Alerts = () => {
    const [delayedTasks, setDelayedTasks] = useState([]);

    useEffect(() => {
        const fetchDelayedTasks = async () => {
            try {
                const response = await axios.get('/tasks/delays');
                setDelayedTasks(response.data);
            } catch (error) {
                console.error("Error fetching delayed tasks:", error);
            }
        };

        fetchDelayedTasks();
    }, []);

    if (delayedTasks.length === 0) {
        return <div>No delayed tasks.</div>;
    }

    return (
        <div>
            <h2>Delayed Tasks</h2>
            <ul>
                {delayedTasks.map(order => (
                    <li key={order._id}>
                        <h3>Order ID: {order.orderId}</h3>
                        <ul>
                            {order.tasks.map(task => (
                                <li key={task._id}>
                                    <p>Task Name: {task.taskName}</p>
                                    <p>Due Date: {new Date(task.dueDate).toLocaleString()}</p>
                                    <p>Assigned To: {task.assignedTo?.name || "Not Assigned"}</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Alerts;