const Task = require("../Model/TaskModel");
const Emp = require("../Model/EmpModel");
const AI = require("../Utils/taskAI"); // ✅ Corrected path to AI module

// ✅ Create Task Schedule using AI
const createTaskSchedule = async (req, res) => {
    const { orderId, requirements, deadline } = req.body; // Include deadline for risk analysis
    try {
        // Call AI to generate tasks
        const aiResponse = await AI.generateTasks({ requirements, deadline });

        if (!aiResponse) {
            return res.status(500).json({ message: "AI task generation failed." });
        }

        // Process AI response into structured tasks
        const assignedTasks = aiResponse.tasks.map(task => ({
            taskName: task.taskName,
            assignedTo: task.assignedTo,
            estimatedTime: task.estimatedTime,
            status: "Pending"
        }));

        // Save task schedule to database
        const newTaskSchedule = new Task({
            orderId,
            tasks: assignedTasks,
            totalEstimatedTime: aiResponse.totalEstimatedTime,
            riskLevel: aiResponse.riskLevel,
            suggestedNewDeadline: aiResponse.suggestedNewDeadline || null,
            customerApproval: "Pending"
        });

        await newTaskSchedule.save();

        return res.status(200).json({ message: "Task schedule created, awaiting customer approval.", newTaskSchedule });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error generating task schedule." });
    }
};

// ✅ Approve or Decline Task Schedule
const approveOrDeclineTask = async (req, res) => {
    const { id } = req.params;
    const { approvalStatus } = req.body;
    try {
        const taskSchedule = await Task.findByIdAndUpdate(id, { customerApproval: approvalStatus }, { new: true });
        if (!taskSchedule) return res.status(404).json({ message: "Task schedule not found." });

        // If declined, cancel order
        if (approvalStatus === "Declined") {
            await Task.findByIdAndDelete(id);
            return res.status(200).json({ message: "Task schedule was declined and order has been canceled." });
        }

        return res.status(200).json({ message: "Task schedule updated.", taskSchedule });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating approval status." });
    }
};

exports.createTaskSchedule = createTaskSchedule;
exports.approveOrDeclineTask = approveOrDeclineTask;
