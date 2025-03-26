// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Import the CSS file

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
        setOngoingCount(orders.data.filter(order => order.progress >= 0 && order.progress < 100 && order.customerApproval === "Approved").length);
        setCompletedCount(orders.data.filter(order => order.progress === 100).length);
        setDelayedCount(delayed.data.length);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-grid-item pending">
          <h3>Pending Orders</h3>
          <p className="count">{pendingCount}</p>
        </div>
        <div className="dashboard-grid-item ongoing">
          <h3>Ongoing Orders</h3>
          <p className="count">{ongoingCount}</p>
        </div>
        <div className="dashboard-grid-item completed">
          <h3>Completed Orders</h3>
          <p className="count">{completedCount}</p>
        </div>
        <div className="dashboard-grid-item delayed">
          <h3>Delayed Tasks</h3>
          <p className="count">{delayedCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;