const express = require("express");
const router = express.Router();

const OrderController =  require("../Controllers/OrderController");

router.post("/", OrderController.createOrder); // OM1
router.get("/:orderId", OrderController.getOrderById); // OM8
router.get("/user/:userId", OrderController.getUserOrders); // OM2
router.put("/:orderId", OrderController.updateOrder); // OM3
router.delete("/:orderId", OrderController.deleteOrder); // OM4
router.get("/", OrderController.getAllOrders); // OM5
router.put("/status/:orderId", OrderController.updateOrderStatus); // OM6
router.get("/reports/sales", OrderController.generateOrderReports); // OM7

module.exports = router;