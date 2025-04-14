const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require("../Controllers/ProductController");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/images/products'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Routes
router.get("/", productController.getAllProducts);
router.post("/", upload.single('image'), productController.addProduct);
router.get("/:id", productController.getById);
router.put("/:id", upload.single('image'), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;