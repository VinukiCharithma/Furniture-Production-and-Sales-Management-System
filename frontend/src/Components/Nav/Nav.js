import React from "react";
import "./nav.css";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div className="navbar">
      <ul>
        <li>
          <Link to="/mainhome">
            <h1>Home</h1>
          </Link>
        </li>
        <li>
          <Link to="/travelguide">
            <h1>Travel Guides</h1>
          </Link>
        </li>
        <li>
          <Link to="/visit">
            <h1>Destinations</h1>
          </Link>
        </li>
        <li>
          <Link to="/rent">
            <h1>Tours</h1>
          </Link>
        </li>
        <li>
          <Link to="/yourstory">
            <h1>Blog</h1>
          </Link>
        </li>
        <li>
          <Link to="/displayUser">
            <h1>Add Users</h1>
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <h1>All Users</h1>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
