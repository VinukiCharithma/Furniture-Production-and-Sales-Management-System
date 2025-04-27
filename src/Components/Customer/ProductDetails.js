import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // State for quantity
  const navigate = useNavigate();

  // Fetch product details from API
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Fetch product details when the component mounts or id changes
  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (!product) {
    return <div>Loading product details...</div>;
  }

  const handleAddToCart = () => {
    // Logic to add the product to cart (this could be a context or state management logic)
    console.log(`Added ${quantity} of ${product.name} to the cart`);
    alert(`${quantity} of ${product.name} added to your cart.`);
  };

  const handleBuyNow = () => {
    // Logic to directly proceed with the checkout
    console.log(`Proceeding to checkout with ${quantity} of ${product.name}`);
    alert(`Proceeding to checkout with ${quantity} of ${product.name}`);
    // You can navigate to a checkout page here
    navigate("/checkout");
  };

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image" />
        </div>
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-category"><strong>Category:</strong> {product.category}</p>
          <p className="product-price"><strong>Price:</strong> Rs.{product.price}</p>
          <p className="product-material"><strong>Material:</strong> {product.material}</p>
          <p className={product.availability ? "available-for-customization" : "not-available"}>
            {product.availability ? "Available for Customization" : "Not Available"}
          </p>

          

          {/* Quantity Selector */}
          {product.availability && (
            <div className="quantity-container">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                max={product.stock} // Assuming the product has a "stock" field
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          )}

          {/* Add to Cart and Buy Now Buttons */}
          <div className="action-buttons">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now" onClick={handleBuyNow}>
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
