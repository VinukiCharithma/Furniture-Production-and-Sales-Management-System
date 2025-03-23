import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrder } from "../Services/orderService";

const UpdateOrder = () => {
  const { orderId } = useParams();
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const order = await getOrderById(orderId);
      setItems(order.items);
    };
    fetchOrder();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = { items };
    await updateOrder(orderId, orderData);
    navigate(`/orders/${orderId}`);
  };

  return (
    <div>
      <h2>Update Order</h2>
      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Product ID"
              value={item.productId}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].productId = e.target.value;
                setItems(newItems);
              }}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].quantity = e.target.value;
                setItems(newItems);
              }}
            />
          </div>
        ))}
        <button type="submit">Update Order</button>
      </form>
    </div>
  );
};

export default UpdateOrder;