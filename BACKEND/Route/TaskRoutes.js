const express = require("express");
const router = express.Router();
const TaskController = require("../Controllers/TaskController");

router.post("/schedule", TaskController.createTaskSchedule);
router.put("/approve/:id", TaskController.approveOrDeclineTask);

module.exports = router;