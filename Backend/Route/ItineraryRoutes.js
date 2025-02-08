const express = require("express");
const router = express.Router();

const Itinerary = require("../Model/ItineraryModel");

const ItineraryController = require("../Controllers/ItineraryController");

router.get("/:userId",ItineraryController.getUserItineraries);
router.post("/",ItineraryController.createItinerary);
router.get("/single/:id",ItineraryController.getItineraryById);
router.put("/:id",ItineraryController.updateItinerary);
router.delete("/:id",ItineraryController.deleteItinerary);

module.exports = router;

