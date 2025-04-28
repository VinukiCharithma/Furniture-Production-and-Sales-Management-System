require('dotenv').config();
//db password: Vinux1218
const express = require("express");
const mongoose = require("mongoose");
const empRouter = require("./Route/EmpRoutes");
const taskRouter = require("./Route/TaskRoutes");
const path = require('path');
const app = express();

//connnecting middleware
app.use(express.json());
app.use("/employees", empRouter);
app.use("/tasks", taskRouter);
// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err) => console.log((err)));