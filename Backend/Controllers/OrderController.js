const Order = require("../Model/OrderModel");
const Product = require("../Model/ProductModel"); 

// Create Order (OM1) - System calculates total amount
const createOrder = async (req, res) => {
    try {
        const { userId, items } = req.body; // items should contain [{ productId, quantity }]
        
        let totalAmount = 0;
        const detailedItems = [];

        // Fetch product details and calculate total price
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
            }
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;
            detailedItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                totalPrice: itemTotal
            });
        }

        // Create new order
        const order = new Order({ userId, items: detailedItems, totalAmount });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Order by Order ID (OM8) 
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate("userId", "name email");
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User Orders (OM2)
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Order Before Processing (OM3)
const updateOrder = async (req, res) => {
    try {
        const { items } = req.body; // items should contain [{ productId, quantity }]
        
        let totalAmount = 0;
        const updatedItems = [];

        // Fetch product details and calculate new total price
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
            }
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;
            updatedItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                totalPrice: itemTotal
            });
        }

        // Update order
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.orderId,
            { items: updatedItems, totalAmount },
            { new: true }
        );

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Order Before Processing (OM4)
const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.orderId);
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Get All Orders & Manage (OM5)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Delivery Status (OM6)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        );
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Generate Order Reports (OM7)
const generateOrderReports = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            { $group: { _id: "$status", totalSales: { $sum: "$totalAmount" } } },
        ]);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrderById, 
    getUserOrders,
    updateOrder,
    deleteOrder,
    getAllOrders,
    updateOrderStatus,
    generateOrderReports,
};
