const express = require("express");
const router = express.Router();
const TaskController = require("../Controllers/TaskController");

// 📌 Task Management Routes
router.get("/orders", TaskController.getOrdersByPriority);  // Get all orders sorted by priority
router.post("/preview-tasks", TaskController.previewTaskSchedule); // Preview AI-generated tasks
router.post("/schedule", TaskController.saveTaskSchedule); // Save confirmed AI-generated tasks
router.put("/update/:id", TaskController.updateTaskSchedule); // Update task priority or timeline

// 📊 Progress Tracking
router.get("/progress/:id", TaskController.trackOrderProgress); // Track order progress
router.get("/delays", TaskController.checkForDelays); // Check for delayed tasks

// 🔍 Employee-Specific Tasks
router.get("/tasks-by-employee/:employeeId", TaskController.getTasksByEmployee); // Get tasks assigned to a specific employee
router.put("/update-task-progress", TaskController.updateTaskProgress); // Employees update task status

module.exports = router;
