import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../Services/orderService";

const Checkout = () => {
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = { items };
    await createOrder(orderData);
    navigate("/order-confirmation");
  };

  return (
    <div>
      <h2>Checkout</h2>
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
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;