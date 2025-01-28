import React, { useState } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserDetails() {
  const history = useNavigate();
  const [inputs ,setInputs] = useState({
    username: "",
    gmail: "",
    password: "",
    bio: "",
    followers: "",
    following: "",
  });

  const handleChange = (e)=>{
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e)=>{
    e.preventDefault();
    console.log(inputs);
    sendRequest().then();
    history('/profile');
  }

  const sendRequest = async ()=>{
    await axios.post("http://Localhost:5000/users",{
      username: String(inputs.username),
      gmail: String(inputs.gmail),
      password: String(inputs.password),
      bio: String(inputs.bio),
      followers: Number(inputs.followers),
      following: Number(inputs.following),
    }).then(res => res.data);
  }

  return (
    <div>
      <Nav />
      <h3>add user</h3>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <br/>
        <input type="text" name="username" onChange={handleChange} value={inputs.username} required></input>
        <br></br>
        <br></br>
        <label>Gmail</label>
        <br/>
        <input type="gmail" name="gmail" onChange={handleChange} value={inputs.gmail} required></input>
        <br></br>
        <br></br>
        <label>Password</label>
        <br/>
        <input type="password" name="password" onChange={handleChange} value={inputs.password} required></input>
        <br></br>
        <br></br>
        <label>bio</label>
        <br/>
        <input type="text" name="bio" onChange={handleChange} value={inputs.bio} required></input>
        <br></br>
        <br></br>
        <label>Followers</label>
        <br/>
        <input type="number" name="followers" onChange={handleChange} value={inputs.followers} required></input>
        <br></br>
        <br></br>
        <label>Following</label>
        <br/>
        <input type="number" name="following" onChange={handleChange} value={inputs.following} required></input>
        <br></br>
        <br></br>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default UserDetails;
