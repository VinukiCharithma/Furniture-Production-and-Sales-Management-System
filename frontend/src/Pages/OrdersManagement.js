import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './OrdersManagement.css';

const OrdersManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    sort: 'newest',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${user.token}` },
          params: {
            status: filters.status || undefined,
            sort: filters.sort,
            page: filters.page,
            limit: filters.limit
          }
        });
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin) {
      fetchOrders();
    } else {
      navigate('/');
    }
  }, [user, navigate, filters]);

  const handleStatusChange = async (orderId, action) => {
    try {
      let endpoint = '';
      let payload = {};
      
      switch(action) {
        case 'start-processing':
          endpoint = `${orderId}/start-processing`;
          break;
        case 'start-shipping':
          endpoint = `${orderId}/start-shipping`;
          payload = { trackingNumber: `TRACK-${Math.floor(Math.random() * 1000000)}` };
          break;
        case 'confirm-delivery':
          endpoint = `${orderId}/confirm-delivery`;
          break;
        default:
          return;
      }
      
      const response = await axios.put(`/api/orders/${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // Update the order in state
      setOrders(orders.map(order => 
        order._id === orderId ? response.data : order
      ));
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
            onClick={() => handleStatusChange(order._id, 'start-processing')}
          >
            Start Processing
          </button>
        );
      case 'processing':
        return (
          <div className="processing-actions">
            <p>Items to complete: {order.items.filter(i => !i.completed).length}</p>
            <button 
              className="action-button complete"
              onClick={() => navigate(`/admin/orders/${order._id}`)}
            >
              Manage Items
            </button>
          </div>
        );
      case 'completed':
        return (
          <button 
            className="action-button ship"
            onClick={() => handleStatusChange(order._id, 'start-shipping')}
          >
            Start Shipping
          </button>
        );
      case 'shipped':
        return (
          <button 
            className="action-button deliver"
            onClick={() => handleStatusChange(order._id, 'confirm-delivery')}
          >
            Confirm Delivery
          </button>
        );
      default:
        return null;
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
            <option value="completed">Completed</option>
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
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
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
          <div className="no-orders">No orders found matching your criteria</div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="order-row">
              <div className="order-id">
                <span onClick={() => navigate(`/admin/orders/${order._id}`)}>
                  #{order._id.slice(-6)}
                </span>
              </div>
              <div className="customer">
                {order.userId?.name || 'Unknown'}
                <small>{order.userId?.email || ''}</small>
              </div>
              <div className="date">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className={`status ${order.status}`}>
                {order.status}
              </div>
              <div className="total">
                Rs. {order.totalPrice.toFixed(2)}
              </div>
              <div className="actions">
                {getStatusActions(order)}
              </div>
            </div>
          ))
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          >
            Previous
          </button>
          <span>Page {filters.page} of {totalPages}</span>
          <button 
            disabled={filters.page === totalPages}
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