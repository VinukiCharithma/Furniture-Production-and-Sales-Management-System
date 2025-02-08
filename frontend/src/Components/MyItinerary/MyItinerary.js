import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";

function MyItinerary({ userId, onSelect = () => {} }) {  
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");  // State for success message

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/itineraries/6795e7fa397bb7a496c8a163`)  
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.itineraries)) {
          setItineraries(data.itineraries);
        } else {
          console.error("Unexpected data format:", data);
          setItineraries([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching itineraries:", error);
        setItineraries([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const handleUpdate = (event, itinerary) => {
    event.stopPropagation();  
    onSelect(itinerary);
  };

  const handleDelete = (event, id) => {
    event.stopPropagation();  
    fetch(`http://localhost:5000/itineraries/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItineraries(itineraries.filter((itinerary) => itinerary._id !== id));
          setMessage("Itinerary is deleted");  // Set success message
          setTimeout(() => setMessage(""), 3000);  // Clear message after 3 seconds
        } else {
          console.error("Failed to delete itinerary.");
        }
      })
      .catch((error) => {
        console.error("Error deleting itinerary:", error);
      });
  };

  return (
    <div>
      <Nav />
      <h3>My Itineraries</h3>

      {/* Show message if itinerary is deleted */}
      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}

      {loading ? (
        <p>Loading itineraries...</p>
      ) : itineraries.length === 0 ? (
        <p>No itineraries found.</p>
      ) : (
        <ul>
          {itineraries.map((itinerary) => (
            <li
              key={itinerary._id}
              onClick={() => onSelect(itinerary)}
              style={{
                cursor: "pointer",
                marginBottom: "10px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <h4>{itinerary.tripName}</h4>
              <p><strong>Destination:</strong> {itinerary.destination.join(", ")}</p>
              <p><strong>Start Date:</strong> {new Date(itinerary.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(itinerary.endDate).toLocaleDateString()}</p>
              <p><strong>Total Budget:</strong> ${itinerary.totalBudget}</p>
              <button onClick={(event) => handleUpdate(event, itinerary)}>Update</button>
              <button onClick={(event) => handleDelete(event, itinerary._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyItinerary;
