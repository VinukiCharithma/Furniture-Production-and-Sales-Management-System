//oIX3igYjNxllEW5u = password

const express = require("express");
const mongoose = require("mongoose");

const router = require("./routes/ProductRoute");

const app = express();
const cors = require("cors");

//Middleware
app.use(express.json());
app.use("/products", router);
app.use(cors());

mongoose.connect("mongodb+srv://admin:oIX3igYjNxllEW5u@cluster0.hkzll.mongodb.net/")
.then(()=> console.log("Connected to mongo db"))
.then(() => {
    app.listen(5001);
})
.catch((err)=> console.log((err)));