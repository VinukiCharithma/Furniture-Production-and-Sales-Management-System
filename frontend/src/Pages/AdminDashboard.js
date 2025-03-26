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
                    <Link to="/admin/reports" className="admin-card">
                        <h2>View Reports</h2>
                        <p>Sales and analytics reports</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;