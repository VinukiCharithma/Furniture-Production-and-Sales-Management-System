//GDxQk1uwnq9FZGQX

const express = require("express");
const mongoose = require("mongoose");

const router = require("./Route/InventoryRoute");


const app = express();
const cors = require ("cors");



//Middleware
app.use(express.json());
app.use("/inventory",router);
app.use(cors());


mongoose.connect("mongodb+srv://admin:GDxQk1uwnq9FZGQX@cluster0.rsyz5.mongodb.net/")
.then(()=> console.log("Connected to Mongo DB"))
.then(() => {
    app.listen(5001);
})
.catch((err)=> console.log((err)));