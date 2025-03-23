import React, { useEffect, useState } from "react";
import { getCart, removeFromCart } from "../Services/cartService";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getCart("USER_ID"); // Replace "USER_ID" with the actual user ID
        setCart(cart.items || []);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setError(error.message || "An error occurred while fetching the cart.");
      }
    };
    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart("USER_ID", productId); // Replace "USER_ID" with the actual user ID
      setCart(cart.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      setError(error.message || "An error occurred while removing the item from the cart.");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item._id}>
            {item.productId.name} - ${item.productId.price} (Quantity: {item.quantity})
            <button onClick={() => handleRemoveFromCart(item.productId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
};

export default Cart;