import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ItineraryDays = () => {
  const { itineraryId } = useParams(); // Get itinerary ID from URL
  const [days, setDays] = useState([]);
  const [day, setDay] = useState(""); // Input for new day number
  const [activities, setActivities] = useState([]); // Activities array
  const [newActivity, setNewActivity] = useState({ time: "", description: "", cost: "" }); // New activity
  const [error, setError] = useState("");

  // Fetch itinerary days
  useEffect(() => {
    const fetchDays = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/itinerarydays/${itineraryId}`);
        setDays(response.data.itineraryDay);
      } catch (err) {
        console.log("Error fetching itinerary days:", err);
        setError("Failed to load itinerary days.");
      }
    };
    fetchDays();
  }, [itineraryId]);

  // Add a new day with activities
  const addDay = async () => {
    try {
      const response = await axios.post("http://localhost:5000/itinerarydays/add", {
        itineraryId,
        day,
        activities,
      });

      setDays([...days, response.data.itineraryDay]); // Update UI
      setDay("");
      setActivities([]);
    } catch (err) {
      console.log("Error adding itinerary day:", err);
      setError("Failed to add day.");
    }
  };

  // Add activity to local state
  const addActivity = () => {
    setActivities([...activities, newActivity]);
    setNewActivity({ time: "", description: "", cost: "" }); // Reset input fields
  };

  // Delete a day
  const deleteDay = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/itinerarydays/delete/${id}`);
      setDays(days.filter((d) => d._id !== id)); // Remove from UI
    } catch (err) {
      console.log("Error deleting day:", err);
      setError("Failed to delete day.");
    }
  };

  return (
    <div>
      <h2>Manage Itinerary Days</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Add Day Form */}
      <input type="number" value={day} onChange={(e) => setDay(e.target.value)} placeholder="Day Number" required />

      <h4>Add Activities</h4>
      <input type="text" value={newActivity.time} onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })} placeholder="Time" required />
      <input type="text" value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} placeholder="Description" required />
      <input type="number" value={newActivity.cost} onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })} placeholder="Cost" required />
      <button onClick={addActivity}>Add Activity</button>

      <button onClick={addDay}>Add Day</button>

      {/* Display Days */}
      {days.length > 0 ? (
        days.map((d) => (
          <div key={d._id}>
            <h3>Day {d.day}</h3>
            {d.activities.map((activity, index) => (
              <p key={index}>
                {activity.time} - {activity.description} (Cost: ${activity.cost})
              </p>
            ))}
            <button onClick={() => deleteDay(d._id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No days added yet.</p>
      )}
    </div>
  );
};

export default ItineraryDays;
