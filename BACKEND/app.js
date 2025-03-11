console.log("bye");
//db password: Vinux1218
const express = require("express");
const mongoose = require("mongoose");

const app = express();
//connnecting middleware
app.use("/",(req, res, next) => {
    res.send("It is working he he he ");
})

mongoose.connect("mongodb+srv://admin:Vinux1218@cluster0.xeiyk.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err) => console.log((err)));