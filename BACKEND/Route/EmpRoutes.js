const express = require("express");
const router = express.Router();

//Insert Model
const Emp = require("../Model/EmpModel");
//Insert Controller
const EmpController = require("../Controllers/EmpController");

router.get("/",EmpController.getAllEmp);
router.post("/",EmpController.addEmp);

//export
module.exports = router;