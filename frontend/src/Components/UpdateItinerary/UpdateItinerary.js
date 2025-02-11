import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateItinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Navigate after update

  // State to store itinerary data
  const [itinerary, setItinerary] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
    totalBudget: "",
  });

  const [error, setError] = useState("");

  // Fetch existing itinerary details
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/itineraries/single/${id}`
        );

        if (response.data.itinerary) {
          // ✅ Step 5: Ensure itinerary exists
          setItinerary({
            ...response.data.itinerary,
            startDate: response.data.itinerary.startDate.split("T")[0], // ✅ Step 3: Format date
            endDate: response.data.itinerary.endDate.split("T")[0],
          });
        }
      } catch (error) {
        console.log("Error fetching itinerary:", error);
        setError("Failed to load itinerary data.");
      }
    };

    fetchItinerary();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItinerary((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/itineraries/${id}`,
        itinerary
      );
      if (response.status === 200) {
        alert("Itinerary Updated Successfully!");
        navigate("/myItinerary"); // Redirect to itineraries list
      }
    } catch (error) {
      setError("Failed to update itinerary. Please try again.");
    }
  };

  return (
    <div>
      <h2>Update Itinerary</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Trip Name:</label>
        <input
          type="text"
          name="tripName"
          value={itinerary.tripName}
          onChange={handleChange}
          required
        />

        <label>Destination:</label>
        <input
          type="text"
          name="destination"
          value={itinerary.destination}
          onChange={handleChange}
          required
        />

        <label>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={itinerary.startDate}
          onChange={handleChange}
          required
        />

        <label>End Date:</label>
        <input
          type="date"
          name="endDate"
          value={itinerary.endDate}
          onChange={handleChange}
          required
        />

        <label>Total Budget:</label>
        <input
          type="number"
          name="totalBudget"
          value={itinerary.totalBudget}
          onChange={handleChange}
          required
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateItinerary;
