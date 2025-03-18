//oIX3igYjNxllEW5u = password

const express = require("express");
const mongoose = require("mongoose");

const router = require("./routes/ProductRoute");
const exportRoutes = require("./routes/exportRoutes");

const app = express();
const cors = require("cors");


//Middleware
app.use(express.json());
app.use(cors());
app.use('/api',exportRoutes);
app.use("/products", router);



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