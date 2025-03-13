const Task = require("../Model/TaskModel");
const Emp = require("../Model/EmpModel");
const AI = require("../AI/taskAI"); // Simulated AI module

const createTaskSchedule = async (req, res) => {
    const { orderId, requirements } = req.body;
    try {
        const aiResponse = await AI.generateTasks(requirements);
        const assignedTasks = aiResponse.tasks.map(task => ({
            taskName: task.taskName,
            assignedTo: task.assignedTo,
            estimatedTime: task.estimatedTime,
            status: "Pending"
        }));

        const newTaskSchedule = new Task({
            orderId,
            tasks: assignedTasks,
            totalEstimatedTime: aiResponse.totalEstimatedTime,
            riskLevel: aiResponse.riskLevel,
        });
        await newTaskSchedule.save();

        return res.status(200).json(newTaskSchedule);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error generating task schedule." });
    }
};

const approveOrDeclineTask = async (req, res) => {
    const { id } = req.params;
    const { approvalStatus } = req.body;
    try {
        const taskSchedule = await Task.findByIdAndUpdate(id, { customerApproval: approvalStatus }, { new: true });
        if (!taskSchedule) return res.status(404).json({ message: "Task schedule not found." });
        return res.status(200).json(taskSchedule);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating approval status." });
    }
};

exports.createTaskSchedule = createTaskSchedule;
exports.approveOrDeclineTask = approveOrDeclineTask;