const Task = require("../Model/TaskModel");
const Emp = require("../Model/EmpModel");
const AI = require("../Utils/taskAI");

// 1️⃣ Fetch all orders sorted by priority
const getOrdersByPriority = async (req, res, next) => {
    try {
        const tasks = await Task.find().sort({ priorityLevel: -1 });
        return res.status(200).json(tasks);
    } catch (error) {
        next(error); // Passes error to middleware
    }
};

// 2️⃣ Preview AI-generated tasks before saving
const previewTaskSchedule = async (req, res, next) => {
    const { requirements, deadline } = req.body;
    try {
        const aiResponse = await AI.generateTasks({ requirements, deadline });

        if (!aiResponse) {
            return res.status(500).json({ message: "AI task generation failed." });
        }

        return res.status(200).json({ 
            message: "AI-generated tasks ready for review.", 
            tasks: aiResponse.tasks, 
            totalEstimatedTime: aiResponse.totalEstimatedTime,
            riskLevel: aiResponse.riskLevel,
            suggestedNewDeadline: aiResponse.suggestedNewDeadline || null
        });

    } catch (error) {
        next(error);
    }
};

// 3️⃣ Save AI-generated task schedule after user confirmation
const saveTaskSchedule = async (req, res, next) => {
    const { orderId, priorityLevel, tasks, totalEstimatedTime, riskLevel, suggestedNewDeadline } = req.body;

    try {
        const newTaskSchedule = new Task({
            orderId,
            priorityLevel,
            tasks,
            totalEstimatedTime,
            riskLevel,
            suggestedNewDeadline: suggestedNewDeadline || null,
            customerApproval: "Pending"
        });

        await newTaskSchedule.save();
        return res.status(200).json({ message: "Task schedule saved successfully.", newTaskSchedule });
    } catch (error) {
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

        return res.status(200).json({ message: "Task status updated.", taskSchedule });
    } catch (error) {
        next(error);
    }
};

exports.getOrdersByPriority = getOrdersByPriority;
exports.previewTaskSchedule = previewTaskSchedule;
exports.saveTaskSchedule = saveTaskSchedule;
exports.updateTaskSchedule = updateTaskSchedule;
exports.trackOrderProgress = trackOrderProgress;
exports.checkForDelays = checkForDelays;
exports.getTasksByEmployee = getTasksByEmployee;
exports.updateTaskProgress = updateTaskProgress;
