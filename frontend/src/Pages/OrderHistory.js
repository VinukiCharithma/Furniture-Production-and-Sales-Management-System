import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/user-orders`, {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { status: filter === 'all' ? undefined : filter, sort }
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [user, navigate, filter, sort]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-secondary',
      processing: 'badge-info',
      completed: 'badge-primary',
      shipped: 'badge-warning',
      delivered: 'badge-success',
      cancelled: 'badge-danger'
    };
    
    return <span className={`badge ${statusClasses[status]}`}>{status}</span>;
  };

  if (loading) return <div className="loading">Loading your orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-history">
      <h1>Your Orders</h1>
      
      <div className="filters">
        <div className="filter-group">
          <label>Filter by status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/products')}>Start Shopping</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card" onClick={() => navigate(`/account/orders/${order._id}`)}>
              <div className="order-header">
                <h3>Order #{order._id}</h3>
                <div className="order-meta">
                  <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="order-preview">
                {order.items.slice(0, 2).map(item => (
                  <div key={item._id} className="preview-item">
                    <img 
                      src={item.productId.image || '/placeholder-product.jpg'} 
                      alt={item.productId.name} 
                    />
                    <span>{item.quantity} × {item.productId.name}</span>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div className="preview-more">+{order.items.length - 2} more items</div>
                )}
              </div>
              
              <div className="order-footer">
                <div className="order-total">Total: Rs. {order.totalPrice.toFixed(2)}</div>
                <button 
                  className="view-details"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/account/orders/${order._id}`);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;