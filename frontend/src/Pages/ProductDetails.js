import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(response.data.product);
        setError(null);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProductDetails();
  }, [id]); // Now only depends on id
  
  const handleAddToCart = () => {
    // In a real app, you would add to cart context or Redux store
    console.log(`Added ${quantity} of ${product.name} to cart`);
    alert(`${quantity} ${product.name}(s) added to cart!`);
  };

  const handleBuyNow = () => {
    // In a real app, you would handle checkout process
    console.log(`Buying ${quantity} of ${product.name}`);
    alert(`Proceeding to checkout with ${quantity} ${product.name}(s)`);
    navigate("/checkout");
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  return (
    <div className="product-details-container">
      <div className="product-details">
        <div className="product-image-container">
          <img 
            src={product.image || '/placeholder-image.jpg'} 
            alt={product.name} 
            className="product-image" 
          />
        </div>
        
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Material:</strong> {product.material}</p>
            <p className={`availability ${product.availability ? 'in-stock' : 'out-of-stock'}`}>
              <strong>Availability:</strong> {product.availability ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
          
          <div className="product-price">
            Rs. {product.price.toFixed(2)}
          </div>
          
          {product.availability && (
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
          )}
          
          <div className="action-buttons">
            {product.availability && (
              <>
                <button 
                  className="add-to-cart"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button 
                  className="buy-now"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </>
            )}
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;