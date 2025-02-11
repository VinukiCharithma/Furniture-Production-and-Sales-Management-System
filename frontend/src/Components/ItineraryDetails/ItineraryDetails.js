import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const ItineraryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [days, setDays] = useState([]); // State for days
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Toggle dropdown

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/itineraries/single/${id}`);
        setItinerary(response.data.itinerary);
      } catch (error) {
        console.log("Error fetching itinerary:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDays = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/itinerarydays/${id}`);
        setDays(response.data.itineraryDay); // Set days for this itinerary
      } catch (error) {
        console.log("Error fetching days:", error);
      }
    };

    fetchItinerary();
    fetchDays();
  }, [id]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : itinerary ? (
        <div>
          <h2>{itinerary.tripName}</h2>
          <p>Destination: {itinerary.destination}</p>
          <p>
            From: {new Date(itinerary.startDate).toLocaleDateString()} - To:{" "}
            {new Date(itinerary.endDate).toLocaleDateString()}
          </p>
          <p>Budget: ${itinerary.totalBudget}</p>

          {/* Update Button - Redirects to Update Page */}
          <Link to={`/updateItinerary/${id}`}>
            <button>Update</button>
          </Link>

          {/* Continue Planning Button and Dropdown */}
          <div className="dropdown-container">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="continue-planning-btn">
              Continue Planning ⏬
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                {days.length > 0 ? (
                  days.map((day) => (
                    <button
                      key={day._id}
                      onClick={() => navigate(`/update-day/${day._id}`)}
                      className="dropdown-item"
                    >
                      Day {day.day}
                    </button>
                  ))
                ) : (
                  <p>No days added yet.</p>
                )}

                {/* Add Day Button */}
                <button
                  onClick={() => navigate(`/add-day/${id}`)}
                  className="add-day-btn"
                >
                  ➕ Add Day
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Itinerary not found</p>
      )}
    </div>
  );
};

export default ItineraryDetails;
