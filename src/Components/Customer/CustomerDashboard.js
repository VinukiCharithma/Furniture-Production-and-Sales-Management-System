import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5001/products");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Filter products based on search query and category filter
  useEffect(() => {
    const filteredProducts = products.filter((product) => {
      return (
        (searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true) &&
        (categoryFilter ? product.category.toLowerCase() === categoryFilter.toLowerCase() : true)
      );
    });
    setFilteredProducts(filteredProducts);
  }, [searchQuery, categoryFilter, products]);

  // Fetch products when the component mounts and poll every 10 seconds
  useEffect(() => {
    fetchProducts(); // Initial fetch
    const interval = setInterval(fetchProducts, 10000); // Poll every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div className="customer-dashboard-container">
      <h1>Customer Dashboard</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Products"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {/* Category Filter */}
      <select
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="filter-dropdown"
      >
        <option value="">Select Category</option>
        <option value="living room">Living Room</option>
        <option value="kitchen">Kitchen</option>
        <option value="bedroom">Bedroom</option>
        <option value="office">Office</option>
      </select>

      {/* Display Filtered Products */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} width="150" />
              <div className="product-details">
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Price:</strong> Rs.{product.price}</p>
                {/* View Details Button that Navigates to Product Details Page */}
                <Link to={`/product-details/${product._id}`}>
                  <button className="view-details-button">View Details</button>
                </Link>
                {/* Add 'Add to Cart' or 'Order' button here if needed */}
              </div>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
