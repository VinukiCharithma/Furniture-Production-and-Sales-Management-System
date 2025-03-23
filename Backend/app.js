const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Import routes
const authRoutes = require("./Route/AuthRoutes");
const userRoutes = require("./Route/UserRoutes");
const orderRoutes = require("./Route/OrderRoutes");
const wishlistRoutes = require("./Route/WishlistRoutes");
const productRoutes = require("./Route/ProductRoutes");
const cartRoutes = require("./Route/CartRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/wishlists", wishlistRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:LSU3X5WXNVLEimhz@cluster0.ze9pt.mongodb.net/your-database-name";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});