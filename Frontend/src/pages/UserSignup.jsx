import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import arrow from "../assets/loginAssets/arrow_back.svg";
import ellipse from "../assets/loginAssets/Ellipse 1.svg";
import sllipse1 from "../assets/loginAssets/Ellipse 2.svg";
import google from "../assets/loginAssets/Vector.svg";
import aster from "../assets/loginAssets/Polygon 2.svg";
import "./UserSignup.css";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const validatePasswords = () => {
    if (password && confirmpass) {
      if (password !== confirmpass) {
        setError("Enter same password in both fields.");
        return false;
      }
      setError("");
      return true;
    }
    setError("");
    return false;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) {
      return;
    }

    const newUser = { username, email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
        newUser
      );

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        // alert("User created successfully");
        navigate("/Login");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Something went wrong!");
      } else if (error.request) {
        alert("No response from the server. Please try again later.");
      } else {
        alert("An error occurred: " + error.message);
      }
    }

    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmpass("");
  };

  const getBorderColor = () => {
    if (!confirmpass) return "lightgray";
    return password === confirmpass ? "green" : "red";
  };
  const getTextColor = () => {
    if (!confirmpass) return "white";
    return password === confirmpass ? "green" : "red";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
      className="maincontainer"
    >
      <img className="ellipse" src={ellipse} alt="" />
      <div className="formcontainer">
        <img
          className="arrow"
          src={arrow}
          onClick={() => navigate(-1)}
          alt="backarrow"
        />
        <form onSubmit={submitHandler}>
          <h3 className="email">Username</h3>
          <input
            className="emailinput"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter a username"
            minLength={3}
          />
          <h3 className="email">Email</h3>
          <input
            className="emailinput"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            minLength={6}
          />
          <h3 className="password" style={{ color: getTextColor() }}>
            Password
          </h3>
          <input
            className="passinput"
            style={{ borderColor: getBorderColor() }}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePasswords();
            }}
            required
            placeholder="********"
            minLength={6}
          />
          <h3 className="password" style={{ color: getTextColor() }}>
            Confirm Password
          </h3>
          <input
            className="passinput"
            style={{ borderColor: getBorderColor() }}
            type="password"
            value={confirmpass}
            onChange={(e) => {
              setConfirmpass(e.target.value);
              validatePasswords();
            }}
            required
            placeholder="********"
            minLength={6}
          />
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          <button className="loginbtn" type="submit">
            Sign Up
          </button>
          <div className="googlecontainer">
            <p className="or">OR</p>
            <button className="googletext">
              <img className="google" src={google} alt="" /> Sign up with Google
            </button>
          </div>
          <p className="signup">
            Already have an account?{" "}
            <Link to="/Login" className="signupline">
              Login
            </Link>
          </p>
        </form>
        <img className="aster" src={aster} alt="" />
        <img className="sllipse1" src={sllipse1} alt="" />
      </div>
    </div>
  );
};

export default UserSignup;
