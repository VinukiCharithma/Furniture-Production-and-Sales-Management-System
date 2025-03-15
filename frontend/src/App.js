import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home/Home";
import UserProfile from "./Components/UserProfile/User";
import UserDetails from "./Components/UserDetails/UserDetails";
import UpdateUser from "./Components/UpdateUser/UpdateUser";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/mainhome" element={<Home />} />

          <Route path="/displayUser" element={<UserDetails />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/:id" element={<UpdateUser />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
