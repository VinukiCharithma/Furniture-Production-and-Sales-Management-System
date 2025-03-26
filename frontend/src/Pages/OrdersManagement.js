import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import './OrdersManagement.css';

const OrdersManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    sort: '-createdAt',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalOrders: 0
  });

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated || user?.role !== "Admin") {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/orders', { // Changed to '/api/orders'
          headers: { Authorization: `Bearer ${user.token}` },
          params: filters
        });
        
        if (response.data.success) {
          setOrders(response.data.orders);
          setPagination({
            totalPages: response.data.totalPages,
            totalOrders: response.data.totalOrders
          });
        } else {
          setError(response.data.message || 'Failed to load orders');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate, filters, isAuthenticated]);

  const handleStatusChange = async (orderId, action) => {
    try {
      const response = await axios.put(
        `/api/orders/${orderId}/status`, // Changed to '/api/orders'
        { action },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? response.data.order : order
        ));
      } else {
        setError(response.data.message || 'Failed to update order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
    }
  };

  const getStatusActions = (order) => {
    switch(order.status) {
      case 'pending':
        return (
          <button 
            className="action-button process"
            onClick={() => handleStatusChange(order._id, 'process')}
          >
            Start Processing
          </button>
        );
      case 'processing':
        return (
          <button 
            className="action-button ship"
            onClick={() => handleStatusChange(order._id, 'ship')}
          >
            Mark as Shipped
          </button>
        );
      case 'shipped':
        return (
          <button 
            className="action-button deliver"
            onClick={() => handleStatusChange(order._id, 'deliver')}
          >
            Confirm Delivery
          </button>
        );
      default:
        return <span className="no-action">No actions available</span>;
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-management">
      <h1>Orders Management</h1>
      
      <div className="filters">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Sort:</label>
          <select 
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
          </select>
        </div>
      </div>
      
      <div className="orders-list">
        <div className="orders-header">
          <div>Order ID</div>
          <div>Customer</div>
          <div>Date</div>
          <div>Status</div>
          <div>Total</div>
          <div>Actions</div>
        </div>
        
        {orders.length === 0 ? (
          <div className="no-orders">No orders found</div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="order-row">
              <div 
                className="order-id clickable" 
                onClick={() => navigate(`/admin/orders/${order._id}`)}
              >
                #{order._id.slice(-6).toUpperCase()}
              </div>
              <div className="customer">
                {order.userId?.name || 'Guest'}
                <small>{order.userId?.email || ''}</small>
              </div>
              <div className="date">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className={`status ${order.status}`}>
                {order.status}
              </div>
              <div className="total">
                Rs. {order.totalPrice?.toFixed(2) || '0.00'}
              </div>
              <div className="actions">
                {getStatusActions(order)}
              </div>
            </div>
          ))
        )}
      </div>
      
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          >
            Previous
          </button>
          <span>Page {filters.page} of {pagination.totalPages}</span>
          <button 
            disabled={filters.page === pagination.totalPages}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;