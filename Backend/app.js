//password = LSU3X5WXNVLEimhz
const express = require("express");
const mongoose = require("mongoose");
const router = require("./Route/UserRoutes");
const irouter = require("./Route/ItineraryRoutes");
const idrouter = require("./Route/ItineraryDayRoute");

const app = express();
const cors = require("cors");

//Middleware
app.use(express.json());
app.use(cors());
app.use("/users",router);
app.use("/itineraries",irouter);
app.use("/itinerarydays",idrouter);

mongoose.connect("mongodb+srv://admin:LSU3X5WXNVLEimhz@cluster0.ze9pt.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(()=> {
    app.listen(5000);
})
.catch((err)=> console.log((err)));