import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, deleteOrder } from "../Services/orderService";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const order = await getOrderById(orderId);
      setOrder(order);
    };
    fetchOrder();
  }, [orderId]);

  const handleDelete = async () => {
    await deleteOrder(orderId);
    navigate("/orders");
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {order._id}</p>
      <p>User ID: {order.userId}</p>
      <p>Total Amount: ${order.totalAmount}</p>
      <p>Status: {order.status}</p>
      <h3>Items:</h3>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price} (Quantity: {item.quantity})
          </li>
        ))}
      </ul>
      <button onClick={handleDelete}>Delete Order</button>
    </div>
  );
};

export default OrderDetails;