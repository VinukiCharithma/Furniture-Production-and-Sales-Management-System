import React, { useState } from "react";
import "./nav.css";
import { Link } from "react-router-dom";

function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

        {/*write dropdown*/}
        <li className="dropdown">
          <h1
            className="dropdown-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Write
          </h1>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/blog">Write blogs</Link>
              </li>
              <li>
                <Link to="/addItinerary">Create Itineraries</Link>
              </li>
              <li>
                <Link to="/myItinerary">My Itineraries</Link>
              </li>
            </ul>
          )}
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
