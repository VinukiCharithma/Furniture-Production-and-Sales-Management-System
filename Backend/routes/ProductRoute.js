const express = require("express");
const router = express.Router();
const multer = require("multer");  // To handle file upload

//insert model
const Product = require("../models/ProductModel");

//insert product controller
const ProductController = require("../controllers/ProductController");

const bulkUploadRoute = require('./BulkUploadRoute'); // Correct import


// Add the bulk upload route
router.post('/bulk-upload', bulkUploadRoute); // This will point to BulkUploadRoute.js



router.get("/",ProductController.getAllProducts);
router.post("/",ProductController.addProduct);
router.get("/:id",ProductController.getById);
router.put("/:id",ProductController.updateProduct);
router.delete("/:id",ProductController.deleteProduct);


//export
module.exports = router;