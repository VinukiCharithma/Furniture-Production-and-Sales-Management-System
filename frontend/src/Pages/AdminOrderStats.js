import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import api from '../utils/api';
import './AdminOrderStats.css';

const AdminOrderStats = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders/admin/stats');
        setStats(response.data.stats);
        setRecentOrders(response.data.recentOrders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading statistics...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div className="error">No statistics available</div>;

  return (
    <div className="admin-order-stats">
      <div className="stats-cards">
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

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        {recentOrders.length > 0 ? (
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
                <tr key={order._id} onClick={() => navigate(`/admin/orders/${order._id}`)}>
                  <td>#{order._id.substring(0, 8)}</td>
                  <td>{order.userId?.name || 'Guest'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>Rs. {order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent orders found</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrderStats;