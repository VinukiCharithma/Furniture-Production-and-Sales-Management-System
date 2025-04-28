const Task = require("../Model/TaskModel");
const Emp = require("../Model/EmpModel");
const AI = require("../Utils/taskAI");
const OrderIntegration = require("../services/OrderIntegration");
const Order = require("../Model/OrderModel"); // Add this at top
const Product = require("../Model/ProductModel");

// 1️⃣ Fetch all orders sorted by priority
const getOrdersByPriority = async (req, res, next) => {
    try {
        const tasks = await Task.find().sort({ priorityLevel: -1 });
        return res.status(200).json(tasks);
    } catch (error) {
        next(error); // Passes error to middleware
    }
};

//  2️⃣ Preview AI-generated tasks before saving
const previewTaskSchedule = async (req, res, next) => {
    const { orderId, deadline } = req.body;

    try {
        // 1. Fetch complete order data
        const order = await Order.findById(orderId)
            .populate('userId')
            .populate('items.productId');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // 2. Prepare requirements string
        const requirements = `
            ORDER DETAILS:
            - Customer: ${order.userId.name}
            - Shipping to: ${order.shippingAddress.city}
            - Items:
            ${order.items.map(item => 
                `  • ${item.quantity}x ${item.productId.name}`
            ).join('\n')}
            - Total Price: $${order.totalPrice}
            - Deadline: ${new Date(deadline).toLocaleDateString()}
        `;

        console.log("Generated Requirements:", requirements);

        // 3. Generate tasks with AI
        const aiResponse = await AI.generateTasks({ 
            requirements, 
            deadline 
        });

        if (!aiResponse) {
            throw new Error("AI generation returned no response");
        }

        // 4. Prepare response with order context
       // In TaskController.js previewTaskSchedule
// 3. Return preview data WITHOUT saving
res.status(200).json({
    message: "Preview generated successfully",
    tasks: aiResponse.tasks,
    totalEstimatedTime: aiResponse.totalEstimatedTime,
    riskLevel: aiResponse.riskLevel,
    orderSnapshot: {
        customer: order.userId.name,
        items: order.items.map(item => ({
            name: item.productId.name,
            quantity: item.quantity
        })),
        address: order.shippingAddress
    }
});

    } catch (error) {
        console.error("Error in previewTaskSchedule:", error);
        res.status(500).json({ 
            message: "Failed to generate tasks",
            details: error.message 
        });
    }
};

// Helper function to extract/generate requirements from order data
function generateRequirementsFromOrderData(orderData) {
    // This is a placeholder - implement your logic here based on your order data structure
    if (orderData && orderData.orderId) {
        return `Generate a task schedule for order ID: ${orderData.orderId}. Consider the priority level: ${orderData.priorityLevel}.`;
    }
    return "Generate a task schedule based on the available order information.";
}

// 3️⃣ Save to DB ONLY when confirmed
const saveTaskSchedule = async (req, res, next) => {
    const { orderId, tasks, totalEstimatedTime, riskLevel} = req.body;

    try {
        // 1. Verify the original order exists in OrderModel
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ 
                message: `Order with ID ${orderId} not found in OrderModel` 
            });
        }

        // 2. Verify order is in processing state
        if (order.status !== "processing") {
            return res.status(400).json({ 
                message: `Order ${orderId} is not in processing state (current status: ${order.status})` 
            });
        }

        // 3. Create new task document in TaskModel
        const newTask = new Task({
            orderId: order._id, // Reference to OrderModel
            originalOrderStatus: "processing",
            priorityLevel: "Medium",
            tasks: tasks.tasks,
            totalEstimatedTime: totalEstimatedTime,
            riskLevel: riskLevel,
            customerApproval: "Approved",
            progress: 0,
            dispatchStatus: false,
            orderDetails: {
                customer: order.userId,
                items: order.items,
                shippingAddress: order.shippingAddress,
                totalPrice: order.totalPrice
            }
    
        });

        // 4. Save to TaskModel
        const savedTask = await newTask.save();

        return res.status(201).json({ 
            message: "New production task schedule created",
            task: savedTask,
            originalOrder: { // Include minimal order info for reference
                id: order._id,
                status: order.status,
                customer: order.userId 
            }
        });

    } catch (error) {
        console.error("Error in saveTaskSchedule:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation error creating task",
                details: error.errors 
            });
        }
        next(error);
    }
};

// 4️⃣ Update Task Priority, Manual Assignment, and Edit Production Timeline
const updateTaskSchedule = async (req, res, next) => {
    const { id } = req.params;
    const { priorityLevel, tasks } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { priorityLevel, tasks }, { new: true });
        return res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

// 5️⃣ Track progress of an order
const trackOrderProgress = async (req, res, next) => {
    const { id } = req.params;
    try {
        const order = await Task.findById(id);
        return res.status(200).json({ progress: order.progress });
    } catch (error) {
        next(error);
    }
};

// 6️⃣ Alert if a task is delayed
const checkForDelays = async (req, res, next) => {
    try {
        const delayedTasks = await Task.find({ "tasks.dueDate": { $lt: new Date() }, "tasks.status": "Pending" });
        return res.status(200).json(delayedTasks);
    } catch (error) {
        next(error);
    }
};

// 7️⃣ Get tasks assigned to a specific employee
const getTasksByEmployee = async (req, res, next) => {
    const { employeeId } = req.params;

    try {
        const tasks = await Task.find({ "tasks.assignedTo": employeeId })
            .populate("tasks.assignedTo", "name skill")
            .exec();

        return res.status(200).json({ tasks });
    } catch (error) {
        next(error);
    }
};

// 8️⃣ Update Task Progress (Mark as In Progress / Completed)
const updateTaskProgress = async (req, res, next) => {
    const { taskId, status } = req.body; // Task ID within the order, and new status
    try {
        // Find the task schedule containing this task
        const taskSchedule = await Task.findOne({ "tasks._id": taskId });

        if (!taskSchedule) {
            return res.status(404).json({ message: "Task not found." });
        }

        // Update task status
        const updatedTasks = taskSchedule.tasks.map(task => {
            if (task._id.toString() === taskId) {
                task.status = status; // "Pending" → "In Progress" → "Completed"
            }
            return task;
        });

        // Save the updated schedule
        taskSchedule.tasks = updatedTasks;
        await taskSchedule.save();

        // After updating task status, check if all tasks are completed
        const allTasksCompleted = updatedTasks.every(task => task.status === "Completed");

        if (allTasksCompleted) {
            // Update the original order status
            await OrderIntegration.updateOrderProgress(taskSchedule.orderId, "shipped");
            
            // Also update task schedule
            taskSchedule.progress = 100;
            taskSchedule.dispatchStatus = true;
            await taskSchedule.save();
        }    

        return res.status(200).json({ message: "Task status updated.", taskSchedule });
    } catch (error) {
        next(error);
    }
};

// New endpoint to sync with orders
const syncWithOrders = async (req, res, next) => {
    try {
        const result = await OrderIntegration.syncProcessingOrders();
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};



exports.syncWithOrders = syncWithOrders;
exports.getOrdersByPriority = getOrdersByPriority;
exports.previewTaskSchedule = previewTaskSchedule;
exports.saveTaskSchedule = saveTaskSchedule;
exports.updateTaskSchedule = updateTaskSchedule;
exports.trackOrderProgress = trackOrderProgress;
exports.checkForDelays = checkForDelays;
exports.getTasksByEmployee = getTasksByEmployee;
exports.updateTaskProgress = updateTaskProgress;