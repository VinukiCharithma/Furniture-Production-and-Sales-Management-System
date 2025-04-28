const Order = require("../Model/OrderModel");
const Task = require("../Model/TaskModel");

class OrderIntegration {
    // Fetch processing orders and create task entries
    static async syncProcessingOrders() {
        try {
            const processingOrders = await Order.find({ status: "processing" });
            
            for (const order of processingOrders) {
                // Check if task entry already exists
                const existingTask = await Task.findOne({ orderId: order._id });
                
                if (!existingTask) {
                    // Create new task entry for this order
                    await Task.create({
                        orderId: order._id,
                        originalOrderStatus: order.status,
                        originalOrder: order._id,
                        // Other default task properties...
                    });
                    console.log(`Created task entry for order ${order._id}`);
                }
            }
            
            return { success: true, processed: processingOrders.length };
        } catch (error) {
            console.error("Error syncing processing orders:", error);
            throw error;
        }
    }

    // Update order status when tasks are completed
    static async updateOrderStatus(orderId, newStatus) {
        try {
            await Order.findByIdAndUpdate(orderId, { status: newStatus });
            return { success: true };
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    }
}

module.exports = OrderIntegration;