import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AdminOrderDetail.css';

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrder(response.data);
        if (response.data.trackingNumber) {
          setTrackingNumber(response.data.trackingNumber);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin) {
      fetchOrder();
    } else {
      navigate('/');
    }
  }, [orderId, user, navigate]);

  const handleCompleteItem = async (itemId) => {
    try {
      const response = await axios.put(
        `/api/orders/${orderId}/complete-item/${itemId}`, 
        {}, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete item');
    }
  };

  const handleStartShipping = async () => {
    try {
      const response = await axios.put(
        `/api/orders/${orderId}/start-shipping`, 
        { trackingNumber },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start shipping');
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      const response = await axios.put(
        `/api/orders/${orderId}/confirm-delivery`, 
        {}, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm delivery');
    }
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Order not found</div>;

  return (
    <div className="admin-order-detail">
      <button className="back-button" onClick={() => navigate('/admin/orders')}>
        &larr; Back to Orders
      </button>
      
      <div className="order-header">
        <h1>Order #{order._id}</h1>
        <div className="order-meta">
          <span className={`status ${order.status}`}>{order.status}</span>
          <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
          <span>Customer: {order.userId?.name || 'Unknown'}</span>
        </div>
      </div>
      
      <div className="order-sections">
        <div className="order-items-section">
          <h2>Order Items</h2>
          <div className="order-items">
            {order.items.map(item => (
              <div key={item._id} className={`order-item ${item.completed ? 'completed' : ''}`}>
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
                
                {!item.completed && order.status === 'processing' && (
                  <button 
                    className="complete-button"
                    onClick={() => handleCompleteItem(item._id)}
                  >
                    Mark Complete
                  </button>
                )}
                
                {item.completed && (
                  <span className="completed-badge">Completed</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>Rs. {order.totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Rs. 0.00</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>Rs. {order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="order-info-section">
          <div className="customer-info">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> {order.userId?.name || 'Unknown'}</p>
            <p><strong>Email:</strong> {order.userId?.email || 'Unknown'}</p>
            <p><strong>Phone:</strong> {order.userId?.phone || 'Not provided'}</p>
          </div>
          
          <div className="shipping-info">
            <h2>Shipping Information</h2>
            <p><strong>Address:</strong> {order.shippingAddress.address}</p>
            <p><strong>City:</strong> {order.shippingAddress.city}</p>
            <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
          </div>
          
          <div className="payment-info">
            <h2>Payment Information</h2>
            <p><strong>Method:</strong> {order.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
            <p><strong>Status:</strong> {order.status === 'delivered' && order.paymentMethod === 'cashOnDelivery' ? 'Paid' : 'Pending'}</p>
          </div>
        </div>
      </div>
      
      <div className="order-actions">
        {order.status === 'completed' && (
          <div className="shipping-action">
            <h3>Prepare for Shipping</h3>
            <div className="tracking-input">
              <label>Tracking Number:</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
            <button 
              className="ship-button"
              onClick={handleStartShipping}
              disabled={!trackingNumber}
            >
              Confirm Shipping
            </button>
          </div>
        )}
        
        {order.status === 'shipped' && (
          <div className="delivery-action">
            <h3>Delivery Confirmation</h3>
            <p>Tracking Number: {order.trackingNumber}</p>
            <p>Shipped on: {new Date(order.shippedAt).toLocaleDateString()}</p>
            <button 
              className="deliver-button"
              onClick={handleConfirmDelivery}
            >
              Confirm Delivery
            </button>
          </div>
        )}
        
        {order.status === 'delivered' && (
          <div className="delivery-confirmation">
            <h3>Order Delivered</h3>
            <p>Delivered on: {new Date(order.deliveredAt).toLocaleDateString()}</p>
            {order.paymentMethod === 'cashOnDelivery' && (
              <p>Cash payment of Rs. {order.totalPrice.toFixed(2)} received.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetail;