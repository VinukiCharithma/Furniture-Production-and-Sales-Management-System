import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import api from '../utils/api';
import './AdminOrderStats.css';

const AdminOrderStats = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    statusCounts: {
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    }
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // 'today', 'week', 'month', 'year', 'all'

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/admin/stats?range=${timeRange}`);
        
        // Ensure we have default values if stats is null
        setStats(response.data.stats || {
          totalOrders: 0,
          totalRevenue: 0,
          statusCounts: {
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
          }
        });
        
        setRecentOrders(response.data.recentOrders || []);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.response?.data?.message || 'Failed to load order statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, navigate, timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      processing: 'badge-processing',
      shipped: 'badge-shipped',
      delivered: 'badge-delivered',
      cancelled: 'badge-cancelled'
    };
    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="loading">Loading statistics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-order-stats">
      <h1>Order Statistics</h1>
      
      {/* Time Range Selector */}
      <div className="time-range-selector">
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-dropdown"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total-orders">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        
        <div className="stat-card total-revenue">
          <h3>Total Revenue</h3>
          <p>{formatCurrency(stats.totalRevenue)}</p>
        </div>
        
        <div className="stat-card processing">
          <h3>Processing</h3>
          <p>{stats.statusCounts.processing}</p>
        </div>
        
        <div className="stat-card shipped">
          <h3>Shipped</h3>
          <p>{stats.statusCounts.shipped}</p>
        </div>
        
        <div className="stat-card delivered">
          <h3>Delivered</h3>
          <p>{stats.statusCounts.delivered}</p>
        </div>
        
        <div className="stat-card cancelled">
          <h3>Cancelled</h3>
          <p>{stats.statusCounts.cancelled}</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="recent-orders-section">
        <h2>Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr 
                    key={order._id} 
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                    className="order-row"
                  >
                    <td>#{order._id.substring(0, 8).toUpperCase()}</td>
                    <td>{order.userId?.name || 'Guest'}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatCurrency(order.totalPrice)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-orders">No recent orders found</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrderStats;