import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrder(response.data);
        
        // Calculate time left for cancellation if order is processing
        if (response.data.status === 'processing' && response.data.processingStartedAt) {
          const processingStart = new Date(response.data.processingStartedAt);
          const deadline = new Date(processingStart.getTime() + 24 * 60 * 60 * 1000);
          updateTimeLeft(deadline);
        }
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

  const updateTimeLeft = (deadline) => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = deadline - now;
      
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft('Cancellation window expired');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    
    return () => clearInterval(timer);
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axios.put(`/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusTimeline = () => {
    const statuses = [
      { id: 'pending', label: 'Order Placed', date: order.createdAt },
      { id: 'processing', label: 'Processing', date: order.processingStartedAt },
      { id: 'completed', label: 'Completed', date: order.status === 'completed' ? order.updatedAt : null },
      { id: 'shipped', label: 'Shipped', date: order.shippedAt },
      { id: 'delivered', label: 'Delivered', date: order.deliveredAt },
      { id: 'cancelled', label: 'Cancelled', date: order.cancelledAt }
    ];
    
    const activeStatusIndex = statuses.findIndex(s => s.id === order.status);
    
    return (
      <div className="status-timeline">
        {statuses.map((status, index) => (
          <div 
            key={status.id}
            className={`timeline-step ${index <= activeStatusIndex ? 'active' : ''} ${status.id === order.status ? 'current' : ''}`}
          >
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h4>{status.label}</h4>
              {status.date && (
                <p>{new Date(status.date).toLocaleString()}</p>
              )}
              {order.status === 'shipped' && status.id === 'shipped' && order.trackingNumber && (
                <p>Tracking: {order.trackingNumber}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Order not found</div>;

  return (
    <div className="order-details-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back to Orders
      </button>
      
      <div className="order-header">
        <h1>Order #{order._id}</h1>
        <div className="order-status">
          <span className={`status-badge ${order.status}`}>{order.status}</span>
          <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      
      {getStatusTimeline()}
      
      <div className="order-sections">
        <div className="order-items-section">
          <h2>Order Items</h2>
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
                  {item.completed && <span className="completed-badge">Completed</span>}
                </div>
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
          <div className="shipping-info">
            <h2>Shipping Information</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
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
      
      {order.status === 'processing' && timeLeft && (
        <div className="cancellation-notice">
          <h3>You can cancel this order within 24 hours of processing</h3>
          <p>Time remaining: {timeLeft}</p>
          <button 
            className="cancel-button"
            onClick={handleCancelOrder}
          >
            Cancel Order
          </button>
        </div>
      )}
      
      {order.status === 'shipped' && order.trackingNumber && (
        <div className="tracking-info">
          <h3>Tracking Information</h3>
          <p>Your order has been shipped with tracking number: <strong>{order.trackingNumber}</strong></p>
          <button 
            className="track-button"
            onClick={() => navigate(`/track-order/${order._id}`)}
          >
            Track Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;