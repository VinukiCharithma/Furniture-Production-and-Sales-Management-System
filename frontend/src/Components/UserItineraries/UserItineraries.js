import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserItineraries = () => {
  const userId = "6795e7fa397bb7a496c8a163"; // Hardcoded user ID for testing
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/itineraries/${userId}`);
        setItineraries(response.data.itineraries);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  // Handle Delete Function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this itinerary?")) return;

    try {
      await axios.delete(`http://localhost:5000/itineraries/${id}`);
      alert("Itinerary Deleted Successfully");

      // Update the list after deletion
      setItineraries(itineraries.filter((itinerary) => itinerary._id !== id));
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      alert("Failed to delete itinerary");
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Your Itineraries</h2>
          {itineraries.length === 0 ? (
            <p>No itineraries found.</p>
          ) : (
            itineraries.map((itinerary) => (
              <div key={itinerary._id}>
                <h3>{itinerary.tripName}</h3>
                <p>Destination: {itinerary.destination.join(", ")}</p>
                <p>
                  From: {new Date(itinerary.startDate).toLocaleDateString()} - To:{" "}
                  {new Date(itinerary.endDate).toLocaleDateString()}
                </p>
                <p>Budget: ${itinerary.totalBudget}</p>

                {/* View Details Button */}
                <Link to={`/myItinerary/${itinerary._id}`}>
                  <button>View Details</button>
                </Link>

                {/* Delete Button */}
                <button onClick={() => handleDelete(itinerary._id)} style={{ color: "red" }}>
                  Delete
                </button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default UserItineraries;
