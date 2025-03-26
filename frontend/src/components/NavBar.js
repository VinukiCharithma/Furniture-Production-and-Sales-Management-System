// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Import the CSS file

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/pending" className="nav-link">Pending Orders</Link>
            <Link to="/ongoing" className="nav-link">Ongoing Orders</Link>
            <Link to="/completed" className="nav-link">Completed Orders</Link>
            <Link to="/alerts" className="nav-link">Alerts</Link>
        </nav>
    );
};

export default Navbar;