import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/cart/${user._id}`);
        setCart(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Failed to load your cart. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await axios.put(`http://localhost:5000/cart/${user._id}/${productId}`, {
        quantity: newQuantity
      });
      // Refresh cart after update
      const response = await axios.get(`http://localhost:5000/cart/${user._id}`);
      setCart(response.data);
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${user._id}/${productId}`);
      // Refresh cart after removal
      const response = await axios.get(`http://localhost:5000/cart/${user._id}`);
      setCart(response.data);
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/cart/${user._id}/clear`);
      setCart({ ...cart, items: [] });
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Failed to clear cart. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading">Loading your cart...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + (item.productId.price * item.quantity),
    0
  );

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.productId._id} className="cart-item">
            <div className="item-image">
              <img 
                src={item.productId.image || '/placeholder-image.jpg'} 
                alt={item.productId.name} 
              />
            </div>
            
            <div className="item-details">
              <h3>
                <Link to={`/products/${item.productId._id}`}>
                  {item.productId.name}
                </Link>
              </h3>
              <p>Price: Rs. {item.productId.price.toFixed(2)}</p>
              
              <div className="quantity-control">
                <button 
                  onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <p className="item-total">
                Total: Rs. {(item.productId.price * item.quantity).toFixed(2)}
              </p>
              
              <button 
                onClick={() => removeItem(item.productId._id)}
                className="remove-item"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>Rs. {totalPrice.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>Rs. {totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="cart-actions">
          <button onClick={clearCart} className="clear-cart">
            Clear Cart
          </button>
          <Link to="/checkout" className="checkout-button">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;