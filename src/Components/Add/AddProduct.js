import React, { useState } from "react";
import axios from "axios";
import './AddProduct.css';

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    price: "",
    material: "",
    image: "",
    availability: true,
  });

  const [errors, setErrors] = useState({}); // Store validation errors

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Validate form fields
  const validateForm = () => {
    let newErrors = {};

    if (!productData.name.trim()) {//remove whitespaces
      newErrors.name = "Product name is required.";
    } else if (productData.name.length < 3) {
      newErrors.name = "Product name must be at least 3 characters long.";
    }

    if (!productData.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (!productData.price) {
      newErrors.price = "Price is required.";
    } else if (isNaN(productData.price) || productData.price <= 0) {//check is it a number?
      newErrors.price = "Price must be a positive number.";
    }

    if (!productData.material.trim()) {
      newErrors.material = "Material is required.";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      await axios.post("http://localhost:5001/products", productData);
      alert("Product added successfully!");
      setProductData({
        name: "",
        category: "",
        price: "",
        material: "",
        image: "",
        availability: true,
      }); // Reset form
      setErrors({}); // Clear errors after successful submission
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={productData.name} onChange={handleInputChange} />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input type="text" name="category" value={productData.category} onChange={handleInputChange} />
          {errors.category && <p className="error">{errors.category}</p>}
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input type="number" name="price" value={productData.price} onChange={handleInputChange} />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>
        <div className="form-group">
          <label>Material:</label>
          <input type="text" name="material" value={productData.material} onChange={handleInputChange} />
          {errors.material && <p className="error">{errors.material}</p>}
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input type="text" name="image" value={productData.image} onChange={handleInputChange} />
          {errors.image && <p className="error">{errors.image}</p>}
        </div>
        <div className="form-group">
          <label>Availability:</label>
          <select name="availability" value={productData.availability} onChange={handleInputChange}>
            <option value={true}>In Stock</option>
            <option value={false}>Out of Stock</option>
            <option value="pre-order">Pre-Order</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
