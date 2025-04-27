//oIX3igYjNxllEW5u = password

const express = require("express");
const mongoose = require("mongoose");

const router = require("./routes/ProductRoute");
const exportRoutes = require("./routes/exportRoutes");
const discountRoutes = require('./routes/DiscountRoute');
const ProductViewRoutes = require('./routes/ProductViewRoutes');
const productReportRoutes = require('./routes/ProductReportRoute');
const analyticsRoutes = require('./routes/AnalyticsRoutes');

const app = express();
const cors = require("cors");


//Middleware
app.use(express.json());
app.use(cors());
app.use('/api/discount', discountRoutes);
app.use('/api',exportRoutes);
app.use('/api', ProductViewRoutes);
app.use("/products", router);
app.use('/reports', productReportRoutes);
app.use('/analytics', analyticsRoutes);

// Start the server
app.listen(5002, () => {
    console.log("Server is running on port 5002");
});


mongoose.connect("mongodb+srv://admin:oIX3igYjNxllEW5u@cluster0.hkzll.mongodb.net/")
.then(()=> console.log("Connected to mongo db"))
.then(() => {
    app.listen(5001);
})
.catch((err)=> console.log((err)));