import axios from "axios";
import React, { useState, useEffect } from "react";
import logout from "../assets/loginAssets/Logout.svg";
import { useNavigate } from "react-router-dom";
import "./Setting.css";
import lock from "../assets/lock.svg";
import profile from "../assets/Frame 1036.svg";

const Setting = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    oldpassword: "",
    password: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Reset the data to initial state when the component mounts
  useEffect(() => {
    setData({
      username: "",
      email: "",
      oldpassword: "",
      password: "",
    });
  }, []);

  const handlesubmit = async (e) => {
    e.preventDefault();

    const { username, email, oldpassword, password } = data;
    if (username && email && oldpassword && password) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/update`,
          { username, email, password, oldpassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          alert("Settings updated successfully!");
          // Optionally reset data or handle after-submit actions
          setData({
            username: "",
            email: "",
            oldpassword: "",
            password: "",
          });
        }
      } catch (error) {
        console.error("Error updating settings:", error);
        alert("An error occurred while updating settings.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/Login");
  };

  return (
    <div className="div1">
      <h2 className="h2">Settings</h2>
      <form className="forms" onSubmit={handlesubmit}>
        <span className="span">
          <img className="imagesw" src={profile} alt="" />
          <input
            className="input2"
            name="username"
            value={data.username}
            onChange={handleChange}
            type="text"
            placeholder="Name"
          />
        </span>

        <span className="span">
          <img className="imagesw" src={lock} alt="" />
          <input
            className="input2"
            name="email"
            value={data.email}
            onChange={handleChange}
            type="email"
            placeholder="Update Email"
          />
        </span>
        <span className="span">
          <img className="imagesw" src={lock} alt="" />
          <input
            className="input2"
            name="oldpassword"
            value={data.oldpassword}
            onChange={handleChange}
            type="password"
            placeholder="Old Password"
          />
        </span>
        <span className="span">
          <img className="imagesw" src={lock} alt="" />
          <input
            className="input2"
            name="password"
            value={data.password}
            onChange={handleChange}
            type="password"
            placeholder="New Password"
          />
        </span>

        <button className="button11" type="submit">
          Update
        </button>
      </form>
      <div className="logout1" onClick={handleLogout}>
        <img className="" src={logout} alt="logout" />
        <p className="p">Log out</p>
      </div>
    </div>
  );
};

export default Setting;
