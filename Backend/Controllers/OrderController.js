const Order = require('../Model/OrderModel');
const Cart = require('../Model/CartModel');
const Product = require('../Model/ProductModel');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Order must contain at least one item" 
      });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ 
        success: false,
        message: "Complete shipping address is required" 
      });
    }

    // Process items with database validation
    let totalPrice = 0;
    const orderItems = [];
    
    for (const item of items) {
      // Validate item structure
      if (!item.product || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: "Each item must contain product and quantity"
        });
      }

      // Get product from database
      const product = await Product.findById(item.product._id || item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product._id || item.product}`
        });
      }

      // Add to order items
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price
      });

      // Calculate total
      totalPrice += product.price * item.quantity;
    }

    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'cashOnDelivery', // Set default
      totalPrice,
      status: 'processing'
    });

    const createdOrder = await order.save();

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } }
    );

    res.status(201).json({
      success: true,
      order: createdOrder
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create order',
      error: error.message 
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name price image')
      .lean(); // Convert to plain JavaScript object

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Ensure userId is included and properly formatted
    order.userId = order.userId?.toString();

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch order',
      error: error.message 
    });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('items.productId', 'name price image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch orders',
      error: error.message 
    });
  }
};

// Get paginated order history
exports.getOrderHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.productId', 'name image');

    const count = await Order.countDocuments({ userId: req.userId });

    res.json({
      success: true,
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalOrders: count
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order history',
      error: error.message
    });
  }
};