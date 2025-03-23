import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h1>User Dashboard</h1>
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/wishlist">Wishlist</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/create-order">Create Order</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;