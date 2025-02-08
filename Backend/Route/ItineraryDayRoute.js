const express = require("express");
const router = express.Router();

const ItineraryDay = require ("../Model/ItineraryDayModel");

const ItineraryDayController = require ("../Controllers/ItineraryDayController");

router.post("/",ItineraryDayController.addDayToItinerary);
router.get("/:itineraryId",ItineraryDayController.getDaysForItinerary);
router.put("/:id",ItineraryDayController.updateDay);
router.delete("/:id",ItineraryDayController.deleteDay);

module.exports = router;