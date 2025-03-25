import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import './TrackOrder.css';

const TrackOrder = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingUpdates, setTrackingUpdates] = useState([]);

  useEffect(() => {
    const fetchOrderAndTracking = async () => {
      try {
        // Fetch order details
        const orderResponse = await axios.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrder(orderResponse.data);
        
        // Simulate tracking updates (in a real app, this would come from your shipping provider API)
        if (orderResponse.data.status === 'shipped' || orderResponse.data.status === 'delivered') {
          const updates = [
            {
              status: 'shipped',
              location: 'Warehouse',
              date: orderResponse.data.shippedAt,
              description: 'Package has left our warehouse'
            },
            {
              status: 'in_transit',
              location: 'Local Facility',
              date: new Date(new Date(orderResponse.data.shippedAt).getTime() + 6 * 60 * 60 * 1000),
              description: 'Package is in transit'
            },
            {
              status: 'out_for_delivery',
              location: 'Nearby Hub',
              date: new Date(new Date(orderResponse.data.shippedAt).getTime() + 24 * 60 * 60 * 1000),
              description: 'Package is out for delivery'
            }
          ];
          
          if (orderResponse.data.status === 'delivered') {
            updates.push({
              status: 'delivered',
              location: orderResponse.data.shippingAddress.city,
              date: orderResponse.data.deliveredAt,
              description: 'Package has been delivered'
            });
          }
          
          setTrackingUpdates(updates);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tracking information');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrderAndTracking();
    } else {
      navigate('/login');
    }
  }, [orderId, user, navigate]);

  if (loading) return <div className="loading">Loading tracking information...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Order not found</div>;

  return (
    <div className="track-order">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back to Order
      </button>
      
      <div className="tracking-header">
        <h1>Track Your Order</h1>
        <p>Order #{order._id}</p>
        <p className={`status ${order.status}`}>
          Current Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </p>
      </div>
      
      {order.status === 'pending' || order.status === 'processing' ? (
        <div className="not-shipped">
          <h2>Your order is being prepared</h2>
          <p>Tracking information will be available once your order has been shipped.</p>
          <p>Current status: <strong>{order.status}</strong></p>
        </div>
      ) : (
        <div className="tracking-container">
          <div className="tracking-info">
            <h2>Tracking Number: {order.trackingNumber}</h2>
            <p>Estimated delivery: {new Date(new Date(order.shippedAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          </div>
          
          <div className="tracking-timeline">
            {trackingUpdates.map((update, index) => (
              <div 
                key={index} 
                className={`timeline-step ${index === trackingUpdates.length - 1 ? 'current' : ''}`}
              >
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{update.description}</h4>
                  <p>{update.location}</p>
                  <p>{new Date(update.date).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          
          {order.status === 'shipped' && (
            <div className="delivery-notice">
              <p>Your order is on its way to you!</p>
              <p>Please allow 1-3 business days for delivery.</p>
            </div>
          )}
          
          {order.status === 'delivered' && (
            <div className="delivery-confirmation">
              <h3>Your order has been delivered</h3>
              <p>Delivered on: {new Date(order.deliveredAt).toLocaleString()}</p>
              <button onClick={() => navigate(`/account/orders/${order._id}`)}>
                View Order Details
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;