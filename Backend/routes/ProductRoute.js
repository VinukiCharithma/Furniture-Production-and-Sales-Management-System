const express = require("express");
const router = express.Router();

//insert model
const Product = require("../models/ProductModel");

//insert product controller
const ProductController = require("../controllers/ProductController");

router.get("/",ProductController.getAllProducts);
router.post("/",ProductController.addProduct);
router.get("/:id",ProductController.getById);
router.put("/:id",ProductController.updateProduct);
router.delete("/:id",ProductController.deleteProduct);

//export
module.exports = router;