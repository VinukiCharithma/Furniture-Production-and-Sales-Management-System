const Product = require("../Model/ProductModel");
const fs = require('fs');
const path = require('path');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ 
      success: true,
      products: products.map(product => ({
        ...product._doc,
        image: product.image ? `/images/products/${product.image}` : null
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add new product
const addProduct = async (req, res) => {
  try {
    const { name, category, price, material, availability } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const product = new Product({
      name,
      category,
      price,
      material,
      availability,
      image
    });

    await product.save();

    res.status(201).json({ 
      success: true,
      product: {
        ...product._doc,
        image: product.image ? `/images/products/${product.image}` : null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get product by ID
const getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ 
      success: true,
      product: {
        ...product._doc,
        image: product.image ? `/images/products/${product.image}` : null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, category, price, material, availability } = req.body;
    const updateData = { name, category, price, material, availability };

    if (req.file) {
      const product = await Product.findById(req.params.id);
      if (product.image) {
        const oldImagePath = path.join(__dirname, '../../public/images/products', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ 
      success: true,
      product: {
        ...updatedProduct._doc,
        image: updatedProduct.image ? `/images/products/${updatedProduct.image}` : null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.image) {
      const imagePath = path.join(__dirname, '../../public/images/products', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ 
      success: true,
      message: "Product deleted successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  getById,
  updateProduct,
  deleteProduct
};