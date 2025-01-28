import React, { useState, useEffect, useRef } from "react";
import Nav from "../Nav/Nav";
import UserDisplay from "../UserDisplay/UserDisplay";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

const URL = "http://Localhost:5000/users";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};
function User() {
  const [users, setUsers] = useState();
  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
  }, []);

  const ComponentsRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => ComponentsRef.current,
    documentTitle: "Users Report",
    onAfterPrint: () => alert("Users Report Successfully Downloaded!"),
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredUsers = data.users.filter((user) =>
        Object.values(user).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setUsers(filteredUsers);
      setNoResults(filteredUsers.length === 0);
    });
  };

  return (
    <div>
      <Nav />
      <h3>User Details</h3>
      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        name="search"
        placeholder="Search User Details"
      ></input>

      <button onClick={handleSearch}>Search</button>

      {noResults ? (
        <div>
          <p>No Users found</p>
        </div>
      ) : (
        <div ref={ComponentsRef}>
          {users &&
            users.map((user, i) => (
              <div key={i}>
                <UserDisplay user={user} />
              </div>
            ))}
        </div>
      )}
      <button onClick={handlePrint}>Download Report</button>
    </div>
  );
}

export default User;
