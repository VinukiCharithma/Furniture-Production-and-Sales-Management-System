import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './EditProduct.css';

const EditProduct = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    price: "",
    material: "",
    image: "",
    availability: true,
  });

  const navigate = useNavigate();

  // Fetch product data for editing
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/products/${id}`);
        if (response.data) {
          setProductData(response.data); // Update state when the data is fetched
        }
      } catch (error) {
        console.log("Error fetching product:", error);
        alert("Error fetching product data");
      }
    };
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedProduct = {
        ...productData,
        availability: productData.availability === 'true' ? true : false, // Ensure boolean value for availability
      };

      const response = await axios.put(
        `http://localhost:5001/products/${id}`,
        updatedProduct
      );
      console.log("Product updated successfully:", response.data);
      alert("Product updated successfully!");
      navigate("/"); // Redirect to the admin dashboard
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <form className="edit-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={productData.name || ''} // Ensure field is empty if no data
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={productData.category || ''} // Ensure field is empty if no data
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={productData.price || ''} // Ensure field is empty if no data
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Material:</label>
          <input
            type="text"
            name="material"
            value={productData.material || ''} // Ensure field is empty if no data
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={productData.image || ''} // Ensure field is empty if no data
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Availability:</label>
          <select
            name="availability"
            value={productData.availability || true} // Ensure field is pre-filled
            onChange={handleInputChange}
            required
          >
            <option value={true}>In Stock</option>
            <option value={false}>Out of Stock</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
