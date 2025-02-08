import React, { useState } from "react";
import Nav from "../Nav/Nav";

function AddItinerary({ onAdd }) {
  const [userId, setUserId] = useState("6795e7fa397bb7a496c8a163");
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const itineraryData = {
      userId,
      tripName,
      destination: destination.split(",").map((d) => d.trim()),
      startDate,
      endDate,
      totalBudget: parseFloat(totalBudget),
    };

    fetch("http://localhost:5000/itineraries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itineraryData),
    })
    
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          onAdd(data.itinerary);
          setTripName("");
          setDestination("");
          setStartDate("");
          setEndDate("");
          setTotalBudget("");
          alert("Itinerary added successfully!");
        } else {
          alert("Failed to add itinerary.");
        }
      })

      .catch(() => {
        console.error("Error:", error);
        alert("An unexpected error occurred.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Nav />
      <h3>Add New Itinerary</h3>

      {successMessage && (
        <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <br />

        <div>
          <label>Trip Name:</label>
          <input
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            required
          />
        </div>
        <br />

        <div>
          <label>Destination (comma separated):</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        <br />

        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <br />

        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <br />

        <div>
          <label>Total Budget:</label>
          <input
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            required
            min="0"
            step="any"
          />
        </div>
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Itinerary"}
        </button>
      </form>
    </div>
  );
}

export default AddItinerary;
