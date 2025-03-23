import React from "react";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <div>
            <Navbar />
            <h1>Admin Dashboard</h1>
            <ul>
                <li><Link to="/admin/users">Manage Users</Link></li>
                <li><Link to="/admin/products">Manage Products</Link></li>
                <li><Link to="/admin/orders">Manage Orders</Link></li>
            </ul>
        </div>
    );
};

export default AdminDashboard;