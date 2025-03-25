import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrder(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrder();
    } else {
      navigate('/login');
    }
  }, [orderId, user, navigate]);

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Order not found</div>;

  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p>Your order number is: <strong>#{order._id}</strong></p>
      </div>
      
      <div className="order-details">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {order.items.map(item => (
              <div key={item._id} className="order-item">
                <img 
                  src={item.productId.image || '/placeholder-product.jpg'} 
                  alt={item.productId.name} 
                />
                <div className="item-details">
                  <h4>{item.productId.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: Rs. {item.price.toFixed(2)}</p>
                  <p>Total: Rs. {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <h3>Total: Rs. {order.totalPrice.toFixed(2)}</h3>
          </div>
        </div>
        
        <div className="shipping-details">
          <h2>Shipping Details</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {order.shippingAddress.address}</p>
          <p><strong>City:</strong> {order.shippingAddress.city}</p>
          <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
        </div>
      </div>
      
      <div className="next-steps">
        <h2>What's Next?</h2>
        <p>You'll receive an email confirmation shortly. We'll notify you when your order ships.</p>
        <button onClick={() => navigate('/account/orders')}>View All Orders</button>
        <button onClick={() => navigate('/products')}>Continue Shopping</button>
      </div>
    </div>
  );
};

export default OrderConfirmation;