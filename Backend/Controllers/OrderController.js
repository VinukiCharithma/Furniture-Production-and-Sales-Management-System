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

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { 
        _id: req.params.id, 
        userId: req.userId,
        status: 'processing'
      },
      { 
        $set: { 
          status: 'cancelled',
          cancelledAt: new Date() 
        } 
      },
      { new: true }
    ).populate('items.productId');

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled or not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// Get tracking information
exports.getTrackingInfo = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name image')
      .lean();

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Verify user owns this order
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    // Simulate tracking updates (in a real app, integrate with shipping provider API)
    let trackingUpdates = [];
    
    if (order.status === 'shipped' || order.status === 'delivered') {
      trackingUpdates = [
        {
          status: 'processing',
          location: 'Warehouse',
          date: order.createdAt,
          description: 'Order received and being processed'
        },
        {
          status: 'shipped',
          location: 'Distribution Center',
          date: order.shippedAt || new Date(order.createdAt.getTime() + 24 * 60 * 60 * 1000),
          description: 'Order has been shipped'
        }
      ];

      if (order.status === 'delivered') {
        trackingUpdates.push({
          status: 'delivered',
          location: order.shippingAddress.city,
          date: order.deliveredAt,
          description: 'Order has been delivered'
        });
      } else {
        trackingUpdates.push({
          status: 'in_transit',
          location: 'In Transit',
          date: new Date((order.shippedAt || new Date()).getTime() + 12 * 60 * 60 * 1000),
          description: 'Package is in transit'
        });
      }
    }

    res.json({
      success: true,
      order,
      trackingUpdates,
      estimatedDelivery: order.status === 'shipped' 
        ? new Date((order.shippedAt || new Date()).getTime() + 3 * 24 * 60 * 60 * 1000)
        : null
    });

  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get tracking information',
      error: error.message 
    });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, sort = '-createdAt', page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: [
        { path: 'userId', select: 'name email' },
        { path: 'items.productId', select: 'name price image' }
      ]
    };
    
    const orders = await Order.paginate(query, options);
    
    res.json({
      success: true,
      orders: orders.docs,
      totalPages: orders.totalPages,
      currentPage: orders.page,
      totalOrders: orders.totalDocs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action } = req.body;
    
    let update = {};
    let status = '';
    
    switch(action) {
      case 'start-processing':
        status = 'processing';
        update = { status, processingStartedAt: new Date() };
        break;
      case 'start-shipping':
        status = 'shipped';
        update = { 
          status, 
          shippedAt: new Date(),
          trackingNumber: req.body.trackingNumber || `TRACK-${Math.floor(Math.random() * 1000000)}`,
          carrier: req.body.carrier || 'Standard Shipping'
        };
        break;
      case 'confirm-delivery':
        status = 'delivered';
        update = { status, deliveredAt: new Date() };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      update,
      { new: true }
    ).populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};