const express = require("express");
const router = express.Router();

// Import order controller
const OrderController = require("../Controllers/OrderController");
const authenticate = require("../middleware/authenticate");

// Order routes
router.post("/", authenticate, OrderController.createOrder);
router.get("/:id", authenticate, OrderController.getOrderById);
router.get("/user/my-orders", authenticate, OrderController.getUserOrders);
router.get('/user/history', authenticate, OrderController.getOrderHistory);
router.put('/:id/cancel', authenticate, OrderController.cancelOrder);
router.get('/:id/tracking', authenticate, OrderController.getTrackingInfo);

// Export
module.exports = router;