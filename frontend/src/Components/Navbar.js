import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // Use "Context" (uppercase)
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            {user?.role === "Admin" && (
              <>
                <li><Link to="/admin">Admin</Link></li>
                <li><Link to="/admin-orders">Admin Orders</Link></li>
                <li><Link to="/order-reports">Order Reports</Link></li>
              </>
            )}
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;