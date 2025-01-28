import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserDisplay(props) {
  const { _id,username, gmail, password, bio, followers, following } = props.user;

  const history = useNavigate();

  const deleteHandler = async() => {
    await axios.delete(`http://Localhost:5000/users/${_id}`)
    .then(res => res.data)
    .then(() => history("/"))
    .then(() => history("/profile"))
  }

  return (
    <div>
      
      <h3>All users...</h3>
      <br></br>

      <h1>ID: {_id}</h1>
      <h1>Name: {username} </h1>
      <h1>Gmail: {gmail}</h1>
      <h1>Password: {password}</h1>
      <h1>Bio: {bio}</h1>
      <h1>Followers: {followers}</h1>
      <h1>Following: {following}</h1>
      <br></br>

      <Link to={`/profile/${_id}`}>Update</Link>
      <button onClick={deleteHandler}>Delete</button>

      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}

export default UserDisplay;
