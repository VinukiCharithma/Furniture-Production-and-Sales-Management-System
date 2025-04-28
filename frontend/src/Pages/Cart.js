import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "./Cart.css";

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/cart/${user._id}`
        );
        setCart(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Failed to load your cart. Please try again later.");
        toast.error("Failed to load your cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const product = cart.items.find(item => item.productId._id === productId)?.productId;
      
      if (product && newQuantity > product.stockQuantity) {
        toast.error(`Only ${product.stockQuantity} available in stock`);
        return;
      }

      await axios.put(`http://localhost:5000/cart/${user._id}/${productId}`, {
        quantity: newQuantity,
      });
      const response = await axios.get(
        `http://localhost:5000/cart/${user._id}`
      );
      setCart(response.data);
      toast.success('Cart updated successfully');
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${user._id}/${productId}`);
      const response = await axios.get(
        `http://localhost:5000/cart/${user._id}`
      );
      setCart(response.data);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/cart/${user._id}/clear`);
      setCart({ ...cart, items: [] });
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading your cart...</div>;
  if (error) return <div className="error">{error}</div>;
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
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.productId._id} className="cart-item">
            <div className="item-image-container">
              <img
                src={item.productId.image || '/placeholder-product.jpg'}
                alt={item.productId?.name || "Product"}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/placeholder-product.jpg';
                }}
                className="cart-item-image"
              />
            </div>

            <div className="item-details">
              <h3>
                <Link to={`/products/${item.productId._id}`}>
                  {item.productId.name}
                </Link>
              </h3>
              <p>Price: Rs. {item.productId.price.toFixed(2)}</p>
              
              <div className="stock-info">
                {item.productId.stockQuantity > 0 ? (
                  <span className="in-stock">
                    In Stock ({item.productId.stockQuantity} available)
                  </span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>

              <div className="quantity-control">
                <button
                  onClick={() =>
                    updateQuantity(item.productId._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => {
                    if (item.quantity < item.productId.stockQuantity) {
                      updateQuantity(item.productId._id, item.quantity + 1);
                    } else {
                      toast.error(`Only ${item.productId.stockQuantity} available`);
                    }
                  }}
                  disabled={item.quantity >= item.productId.stockQuantity}
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