// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
            <Link to="/" style={{ margin: '0 10px', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/pending" style={{ margin: '0 10px', textDecoration: 'none' }}>Pending Orders</Link>
            <Link to="/ongoing" style={{ margin: '0 10px', textDecoration: 'none' }}>Ongoing Orders</Link>
            <Link to="/completed" style={{ margin: '0 10px', textDecoration: 'none' }}>Completed Orders</Link>
            <Link to="/alerts" style={{ margin: '0 10px', textDecoration: 'none' }}>Alerts</Link>
        </nav>
    );
};

export default Navbar;