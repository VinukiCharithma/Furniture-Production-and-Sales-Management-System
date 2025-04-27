// UpdateInventory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "./UpdateInventory.css";

const UpdateInventory = () => {
  const [inventoryItem, setInventoryItem] = useState({
    materialName: '',
    quantity: '',
    unit: '',
    wastageQuantity: '',
    availability: true,
  });
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const API_URL = 'http://localhost:5000/inventory/${id}'; 

  // Fetch the current inventory item data
  useEffect(() => {
    const fetchInventoryItem = async () => {
      try {
        const { data } = await axios.get(API_URL);
        setInventoryItem(data); 
      } catch (error) {
        console.error('Error fetching inventory item:', error);
      }
    };
    fetchInventoryItem();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventoryItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to update the inventory item
  const handleUpdateInventory = async (e) => {
    e.preventDefault();
    try {
      await axios.put(API_URL, inventoryItem); 
      navigate('/'); 
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  return (
    <div className="update-inventory-container">
      <h2>Update Inventory Item</h2>
      <form onSubmit={handleUpdateInventory}>
        <div>
          <label>Material Name:</label>
          <input
            type="text"
            name="materialName"
            value={inventoryItem.materialName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={inventoryItem.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Unit:</label>
          <input
            type="text"
            name="unit"
            value={inventoryItem.unit}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Wastage Quantity:</label>
          <input
            type="number"
            name="wastageQuantity"
            value={inventoryItem.wastageQuantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Availability:</label>
          <select
            name="availability"
            value={inventoryItem.availability}
            onChange={handleChange}
          >
            <option value={true}>In Stock</option>
            <option value={false}>Out of Stock</option>
          </select>
        </div>
        <button type="submit">Update Item</button>
      </form>
    </div>
  );
};

export default UpdateInventory;