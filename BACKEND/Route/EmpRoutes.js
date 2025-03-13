const express = require("express");
const router = express.Router();

//Insert Model
const Emp = require("../Model/EmpModel");
//Insert Controller
const EmpController = require("../Controllers/EmpController");

router.get("/",EmpController.getAllEmp);
router.post("/",EmpController.addEmp);
router.get("/:id",EmpController.getById);
router.put("/:id",EmpController.updateEmp);

//export
module.exports = router;