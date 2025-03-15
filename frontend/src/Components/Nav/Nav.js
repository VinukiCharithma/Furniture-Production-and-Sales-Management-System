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
