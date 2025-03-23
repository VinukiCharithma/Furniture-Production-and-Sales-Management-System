import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../Services/orderService";

const UpdateOrderStatus = () => {
  const { orderId } = useParams();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const order = await getOrderById(orderId);
      setStatus(order.status);
    };
    fetchOrder();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateOrderStatus(orderId, { status });
    navigate(`/orders/${orderId}`);
  };

  return (
    <div>
      <h2>Update Order Status</h2>
      <form onSubmit={handleSubmit}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button type="submit">Update Status</button>
      </form>
    </div>
  );
};

export default UpdateOrderStatus;