//db password: Vinux1218
const express = require("express");
const mongoose = require("mongoose");
const empRouter = require("./Route/EmpRoutes");
const taskRouter = require("./Route/TaskRoutes");

const app = express();

//connnecting middleware
app.use(express.json());
app.use("/emps", empRouter);
app.use("/tasks", taskRouter);

mongoose.connect("mongodb+srv://admin:Vinux1218@cluster0.xeiyk.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err) => console.log((err)));