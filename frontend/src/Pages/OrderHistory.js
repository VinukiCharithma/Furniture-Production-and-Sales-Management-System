import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Added this import
import api from '../utils/api';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Added this hook
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalPages: 1
  });

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await api.get(
          `/orders/user/history?page=${pagination.page}&limit=${pagination.limit}`
        );
        
        setOrders(response.data.orders);
        setPagination(prev => ({ // Fixed the pagination dependency issue
          ...prev,
          totalPages: response.data.totalPages
        }));
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrderHistory();
  }, [user, pagination.page, pagination.limit]); // Added pagination.limit for completeness

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  if (loading) return <div className="loading">Loading order history...</div>;

  return (
    <div className="order-history">
      <h2>Your Order History</h2>
      
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span>Order #{order._id}</span>
                  <span>Rs. {order.totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="order-details">
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Status: {order.status}</p>
                  <p>Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                </div>

                <button 
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          <div className="pagination">
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                disabled={pagination.page === i + 1}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderHistory;