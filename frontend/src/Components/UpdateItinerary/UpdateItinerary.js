import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";

function UpdateItinerary({ itineraryId, onUpdate, onCancel }) {
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the existing itinerary details
    fetch(`http://localhost:5000/itineraries/${itineraryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const itinerary = data.itinerary;
          setTripName(itinerary.tripName);
          setDestination(itinerary.destination.join(", "));
          setStartDate(itinerary.startDate);
          setEndDate(itinerary.endDate);
          setTotalBudget(itinerary.totalBudget);
        } else {
          setError("Failed to fetch itinerary details.");
        }
      })
      .catch((error) => {
        console.error("Error fetching itinerary:", error);
        setError("Error fetching itinerary.");
      });
  }, [itineraryId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const updatedItinerary = {
      tripName,
      destination: destination.split(",").map((d) => d.trim()),
      startDate,
      endDate,
      totalBudget: parseFloat(totalBudget),
    };

    fetch(`http://localhost:5000/itineraries/${itineraryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItinerary),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          onUpdate(data.itinerary);
        } else {
          setError("Failed to update itinerary.");
        }
      })
      .catch((error) => {
        console.error("Error updating itinerary:", error);
        setError("Error updating itinerary.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Nav />
      <h3>Update Itinerary</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
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
          {loading ? "Updating..." : "Update Itinerary"}
        </button>
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default UpdateItinerary;
