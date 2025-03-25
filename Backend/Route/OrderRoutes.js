const express = require("express");
const router = express.Router();

// Import order controller
const OrderController = require("../Controllers/OrderController");
const authenticate = require("../middleware/authenticate");

// Order routes
router.post("/", authenticate, OrderController.createOrder);
router.get("/:id", authenticate, OrderController.getOrderById);
router.get("/user/my-orders", authenticate, OrderController.getUserOrders);

// Export
module.exports = router;