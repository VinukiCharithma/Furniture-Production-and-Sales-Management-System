import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../Services/orderService";

const CreateOrder = () => {
  const [userId, setUserId] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const navigate = useNavigate();

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = { userId, items };
    await createOrder(orderData);
    navigate("/orders");
  };

  return (
    <div>
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
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
        <button type="button" onClick={handleAddItem}>
          Add Item
        </button>
        <button type="submit">Create Order</button>
      </form>
    </div>
  );
};

export default CreateOrder;