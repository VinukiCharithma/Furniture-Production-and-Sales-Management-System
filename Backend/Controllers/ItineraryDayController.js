const ItineraryDay = require("../Model/ItineraryDayModel");

//add day to itinerary
const addDayToItinerary = async (req, res, next) => {
  const { itineraryId, day, activities } = req.body;

  let itineraryDay;

  try {
    itineraryDay = new ItineraryDay({ itineraryId, day, activities });
    await itineraryDay.save();
  } catch (err) {
    console.log(err);
  }
  if (!itineraryDay) {
    return res.status(404).json({ message: "Unable to Add Day to Itinerary" });
  }
  return res.status(200).json({ itineraryDay });
};

//get days for an itinerary
const getDaysForItinerary = async (req, res, next) => {
  let itineraryDay;

  try {
    itineraryDay = await ItineraryDay.find({
      itineraryId: req.params.itineraryId,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
  if (!itineraryDay) {
    return res.status(404).json({ message: "No days for this itinerary" });
  }
  return res.status(200).json({ itineraryDay });
};

//update day
const updateDay = async (req, res, next) => {
  const id = req.params.id;
  const { itineraryId, day, activities } = req.body;

  let itineraryDay;

  try {
    itineraryDay = await ItineraryDay.findByIdAndUpdate(id, {
      itineraryId: itineraryId,
      day: day,
      activities: activities,
    });
    itineraryDay = await itineraryDay.save();

  } catch (err) {
    console.log(err);
  }

  if (!itineraryDay) {
    return res.status(404).json({ message: "Unable to Update Itinerary Day" });
  }
  return res.status(200).json({ itineraryDay });
};

//delete day
const deleteDay = async (req, res, next) => {
    const id = req.params.id;

    let itineraryDay;

    try{
        itineraryDay = await ItineraryDay.findByIdAndDelete(id);
    }catch(err){
        console.log(err);
    }

    if (!itineraryDay) {
        return res.status(404).json({ message: "Unable to Delete Itinerary Day" });
      }
      return res.status(200).json({ itineraryDay });
}

exports.addDayToItinerary = addDayToItinerary;
exports.getDaysForItinerary = getDaysForItinerary;
exports.updateDay = updateDay;
exports.deleteDay = deleteDay;