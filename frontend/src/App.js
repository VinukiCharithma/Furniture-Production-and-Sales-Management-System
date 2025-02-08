import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home/Home";
import TravelGuide from "./Components/TravelGuides/travelguide"
import Destination from "./Components/Destination/destination"
import Tour from "./Components/Tours/tour"
import Blog from "./Components/Blog/blog"
import AddItinerary from "./Components/AddItinerary/AddItinerary";
import MyItinerary from "./Components/MyItinerary/MyItinerary";
import UserProfile from "./Components/UserProfile/User"
import UserDetails from "./Components/UserDetails/UserDetails";
import UpdateUser from "./Components/UpdateUser/UpdateUser";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/mainhome" element={<Home />} />
          <Route path="/travelguide" element={<TravelGuide />} />
          <Route path="/visit" element={<Destination />} />
          <Route path="/rent" element={<Tour />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/addItinerary" element={<AddItinerary />} />
          <Route path="/myItinerary" element={<MyItinerary />} />
          <Route path="/displayUser" element={<UserDetails />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/:id" element={<UpdateUser />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
