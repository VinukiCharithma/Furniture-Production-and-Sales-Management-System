const express = require("express");
const router = express.Router();
const EmpController = require("../Controllers/EmpController");
const upload = require("../middleware/upload"); // For image uploads

// Employee CRUD routes
router.get("/", EmpController.getAllEmployees);
router.get("/:id", EmpController.getEmployee);
router.post("/", upload.single('image'), EmpController.createEmployee);
router.put("/:id", upload.single('image'), EmpController.updateEmployee);
router.delete("/:id", EmpController.deleteEmployee);

module.exports = router;