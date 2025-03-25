// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [pendingCount, setPendingCount] = useState(0);
    const [ongoingCount, setOngoingCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [delayedCount, setDelayedCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orders = await axios.get('/tasks/orders');
                const delayed = await axios.get('/tasks/delays');

                setPendingCount(orders.data.filter(order => order.customerApproval === "Pending").length);
                setOngoingCount(orders.data.filter(order => order.progress > 0 && order.progress < 100).length);
                setCompletedCount(orders.data.filter(order => order.progress === 100).length);
                setDelayedCount(delayed.data.length);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Pending Orders: {pendingCount}</p>
            <p>Ongoing Orders: {ongoingCount}</p>
            <p>Completed Orders: {completedCount}</p>
            <p>Delayed Tasks: {delayedCount}</p>
        </div>
    );
};

export default Dashboard;