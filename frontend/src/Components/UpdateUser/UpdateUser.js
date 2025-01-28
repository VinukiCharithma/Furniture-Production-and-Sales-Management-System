import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

function UpdateUser() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://Localhost:5000/users/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.user));
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://Localhost:5000/users/${id}`, {
        username: String(inputs.username),
        gmail: String(inputs.gmail),
        password: String(inputs.password),
        bio: String(inputs.bio),
        followers: Number(inputs.followers),
        following: Number(inputs.following),
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/profile"));
  };

  return (
    <div>
      <h3>Update user...</h3>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <br />
        <input
          type="text"
          name="username"
          onChange={handleChange}
          value={inputs.username}
          required
        ></input>
        <br></br>
        <br></br>
        <label>Gmail</label>
        <br />
        <input
          type="gmail"
          name="gmail"
          onChange={handleChange}
          value={inputs.gmail}
          required
        ></input>
        <br></br>
        <br></br>
        <label>Password</label>
        <br />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={inputs.password}
          required
        ></input>
        <br></br>
        <br></br>
        <label>bio</label>
        <br />
        <input
          type="text"
          name="bio"
          onChange={handleChange}
          value={inputs.bio}
          required
        ></input>
        <br></br>
        <br></br>
        <label>Followers</label>
        <br />
        <input
          type="number"
          name="followers"
          onChange={handleChange}
          value={inputs.followers}
          required
        ></input>
        <br></br>
        <br></br>
        <label>Following</label>
        <br />
        <input
          type="number"
          name="following"
          onChange={handleChange}
          value={inputs.following}
          required
        ></input>
        <br></br>
        <br></br>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default UpdateUser;
