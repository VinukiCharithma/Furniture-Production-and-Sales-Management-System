import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf'; 
import 'jspdf-autotable';
import './AdminInventory.css';

const AdminInventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // search input
  const [stockStatus, setStockStatus] = useState(""); // stock filter
  const API_URL = 'http://localhost:5000/inventory';

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // You can change this number

  // Fetch the inventory data 
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data } = await axios.get(API_URL);
        setInventoryItems(data.inventoryItems || []); 
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    fetchInventory();
  }, []);

  // Delete action 
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this inventory item?');

    if (isConfirmed) {
      try {
        const response = await axios.delete(`${API_URL}/${id}`);
        if (response.status === 200) {
          setInventoryItems(prevItems => prevItems.filter(item => item._id !== id));
          alert('Item deleted successfully!');
        } else {
          alert('Error deleting item. Please try again later.');
        }
      } catch (error) {
        console.error('Error deleting inventory item:', error);
        alert('Error deleting item. Please try again later.');
      }
    }
  };

  // Filter inventory items 
  const filteredItems = inventoryItems.filter((item) =>
    (item.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.quantity.toString().includes(searchTerm)) &&
    (stockStatus ? item.availability === (stockStatus === "in-stock") : true)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Generate CSV report
  const generateCSV = (data) => {
    const header = Object.keys(data[0]).join(','); // Get the header (keys)
    const rows = data.map(row => Object.values(row).join(',')); // Convert each row into a CSV string
    const csvContent = [header, ...rows].join('\n'); // Combine the header and rows
    
    return csvContent;
  };

  const downloadCSV = (data, fileName = 'inventory_report.csv') => {
    const csv = generateCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.target = '_blank';
    link.download = fileName;
    link.click();
  };
  
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Inventory List", 14, 10);
      const headers = ['Material Name', 'Quantity', 'Unit', 'Wastage Quantity', 'Status'];
      const data = filteredItems.map(item => [
        item.materialName,
        item.quantity,
        item.unit,
        item.wastageQuantity,
        item.availability ? 'In Stock' : 'Out of Stock'
      ]);
  
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 20,
        theme: 'grid',
      });
  
      doc.save('inventory-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Inventory List</h2>
      <Link to="/add-inventory">
        <button className="add-item-btn">Add Inventory Item</button>
      </Link>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by Material Name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Stock Status Filter */}
      <select
        value={stockStatus}
        onChange={(e) => setStockStatus(e.target.value)}
        className="stock-status-filter"
      >
        <option value="">All Items</option>
        <option value="in-stock">In Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>

      {/* Add export buttons */}
      <div className="export-buttons">
        <button onClick={() => downloadCSV(filteredItems)}>Download CSV</button>
        <button onClick={generatePDF}>Download PDF</button>
      </div>

      {currentItems.length === 0 ? (
        <p>No inventory items available.</p>
      ) : (
        <div className="materials-container">
          {currentItems.map((item) => (
            <div className="material-card" key={item._id}>
              <h3>{item.materialName}</h3>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Unit:</strong> {item.unit}</p>
              <p><strong>Wastage Quantity:</strong> {item.wastageQuantity}</p>
              <p><strong>Status:</strong> {item.availability ? 'In Stock' : 'Out of Stock'}</p>
              <div className="button-container">
                <Link to={`/update-inventory/${item._id}`}>
                  <button className="update-btn">Update</button>
                </Link>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminInventory;