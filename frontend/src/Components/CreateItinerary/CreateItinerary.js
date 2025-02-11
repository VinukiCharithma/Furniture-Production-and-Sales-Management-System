import React, { useState } from "react";
import axios from "axios";

const CreateItinerary = () => {
  const userId = "6795e7fa397bb7a496c8a163"; // Hardcoded user ID for testing
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/itineraries", {
        userId,
        tripName,
        destination,
        startDate,
        endDate,
        totalBudget,
      });

      if (response.status === 200) {
        alert("Itinerary Created Successfully");
      }
    } catch (error) {
      setError("Failed to create itinerary. Please try again.");
    }
  };

  return (
    <div>
      <h2>Create Itinerary</h2>
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <input
          type="text"
          placeholder="Trip Name"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Total Budget"
          value={totalBudget}
          onChange={(e) => setTotalBudget(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateItinerary;
