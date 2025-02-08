const Itinerary = require("../Model/ItineraryModel");

//get itineraries by user
const getUserItineraries = async (req, res, next) => {
  let itineraries;

  try {
    itineraries = await Itinerary.find({ userId: req.params.userId });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!itineraries || itineraries.length === 0) {
    return res
      .status(404)
      .json({ message: "No itineraies found for this user" });
  }
  return res.status(200).json({ itineraries });
};

//create itinerary
const createItinerary = async (req, res, next) => {
  const { userId, tripName, destination, startDate, endDate, totalBudget } =
    req.body;

  let itinerary;

  try {
    itinerary = new Itinerary({
      userId,
      tripName,
      destination,
      startDate,
      endDate,
      totalBudget,
    });
    await itinerary.save();
  } catch (err) {
    console.log(err);
  }

  if (!itinerary) {
    return res.status(404).json({ message: "Unable to Create Itinerary" });
  }
  return res.status(200).json({ itinerary });
};

//get single itinerary
const getItineraryById = async (req, res, next) => {
  const id = req.params.id;

  let itinerary;

  try {
    itinerary = await Itinerary.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!itinerary) {
    return res.status(404).json({ message: "itinerary not found" });
  }
  return res.status(200).json({ itinerary });
};

//update itinerary
const updateItinerary = async (req, res, next) => {
  const id = req.params.id;
  const { userId, tripName, destination, startDate, endDate, totalBudget } =
    req.body;

  let itinerary;

  try {
    itinerary = await Itinerary.findByIdAndUpdate(id, {
      userId: userId,
      tripName: tripName,
      destination: destination,
      startDate: startDate,
      endDate: endDate,
      totalBudget: totalBudget,
    });
    itinerary = await itinerary.save();

  } catch (err) {
    console.log(err);
  }

  if(!itinerary) {
    return res.status(404).json({message: "Unable to Update Itinerary Details"});
  }
  return res.status(200).json({itinerary});
};

//delete itinerary
const deleteItinerary = async (req, res, next) => {
    const id = req.params.id;

    let itinerary;

    try{
        itinerary = await Itinerary.findByIdAndDelete(id);
    }catch(err){
        console.log(err);
    }
    if(!itinerary) {
        return res.status(404).json({message: "Unable to Delete Itinerary Details"});
      }
      return res.status(200).json({itinerary});
}

exports.getUserItineraries = getUserItineraries;
exports.createItinerary = createItinerary;
exports.getItineraryById = getItineraryById;
exports.updateItinerary = updateItinerary;
exports.deleteItinerary = deleteItinerary;