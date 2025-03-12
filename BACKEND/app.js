//db password: Vinux1218
const express = require("express");
const mongoose = require("mongoose");
const router = require("./Route/EmpRoutes");

const app = express();

//connnecting middleware
app.use(express.json());
app.use("/emps", router);


mongoose.connect("mongodb+srv://admin:Vinux1218@cluster0.xeiyk.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err) => console.log((err)));