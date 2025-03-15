const Product = require("../Model/ProductModel");

//product display
const getAllProducts = async (reqe, res, next) => {
  let products;

  //get all products

  try {
    products = await Product.find();
  } catch (err) {
    console.log(err);
  }

  //product not found
  if (!products) {
    return res.status(404).json({ message: "Product not found" });
  }

  //display all products
  return res.status(200).json({ products });
};

//insert products
const addProduct = async (req, res, next) => {
  const { name, category, price, material, availability, image } = req.body;

  let product;

  try {
    product = new Product({
      name,
      category,
      price,
      material,
      availability,
      image,
    });
    await product.save();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Server error, unable to add product" });
  }

  //unable to add product
  if (!product) {
    return res.status(400).json({ message: "Unable to add product" });
  }

  return res.status(201).json({ product });
};

//get by id
const getById = async (req, res, next) => {
  const id = req.params.id;

  let product;

  try {
    product = await Product.findById(id);
  } catch (err) {
    console.log(err);
  }

  //if product not avaiable
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  //if product found
  return res.status(200).json({ product });
};

//update product
const updateProduct = async (req, res, next) => {
  const id = req.params.id;
  const { name, category, price, material, availability, image } = req.body;

  let product;

  try {
    product = await Product.findByIdAndUpdate(
      id,
      { name, category, price, material, availability, image },
      { new: true } // Returns the updated document
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Server error, unable to update product" });
  }

  //product not found
  if (!product) {
    return res
      .status(404)
      .json({ message: "Product not found or update failed" });
  }

  return res.status(200).json({ product });
};
//delete product
const deleteProduct = async (req, res, next) => {
  const id = req.params.id;

  let product;

  try {
    product = await Product.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Server error, unable to delete product" });
  }

  //pproduct not found
  if (!product) {
    return res
      .status(404)
      .json({ message: "Product not found or already deleted" });
  }

  return res
    .status(200)
    .json({ message: "Product deleted successfully", product });
};

exports.getAllProducts = getAllProducts;
exports.addProduct = addProduct;
exports.getById = getById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
