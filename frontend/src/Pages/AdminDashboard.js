import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-content">
        <h1>Admin Dashboard</h1>
        <div className="admin-links">
          <Link to="/admin/users" className="admin-card">
            <h2>Manage Users</h2>
            <p>View and manage user accounts</p>
          </Link>
          <Link to="/admin/products" className="admin-card">
            <h2>Manage Products</h2>
            <p>Add, edit, or remove products</p>
          </Link>
          <Link to="/admin/orders" className="admin-card">
            <h2>Manage Orders</h2>
            <p>View and process customer orders</p>
          </Link>
          <Link to="/admin/stats" className="admin-card">
            <h2>Order Statistics</h2>
            <p>View sales and order analytics</p>
          </Link>
          <Link to="/admin/inventory" className="admin-card">
            <h2>Manage Inventory</h2>
            <p>View and manage stock</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
