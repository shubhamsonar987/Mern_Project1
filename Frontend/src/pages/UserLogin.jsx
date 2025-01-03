import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import arrow from "../assets/loginAssets/arrow_back.svg";
import ellipse from "../assets/loginAssets/Ellipse 1.svg";
import sllipse1 from "../assets/loginAssets/Ellipse 2.svg";
import google from "../assets/loginAssets/Vector.svg";
import aster from "../assets/loginAssets/Polygon 2.svg";
import "./UserLogin.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState({});

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const login = {
      email,
      password,
    };
    try {
      const responce = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        login
      );
      if (responce.status === 200) {
        const data = responce.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        // alert("Login successful");
        navigate("/home");
        //to hide credentials from frontend
        window.location.reload();
      }
    } catch (error) {
      if (error.response) {
        // Server returned an error response
        alert(error.response.data.message || "Login failed. Please try again.");
      } else if (error.request) {
        // Request made but no response received
        alert("No response from the server. Please check your connection.");
      } else {
        // Other errors
        alert(`An error occurred: ${error.message}`);
      }
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="maincontainer">
      <img className="ellipse" src={ellipse} alt="" />
      <div className="formcontainer">
        <img
          className="arrow"
          onClick={() => navigate(-1)}
          src={arrow}
          alt="backarrow"
        />
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="email">Email</h3>
          <input
            className="emailinput"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Enter your email"
            minLength={6}
          />
          <h3 className="password"> Password</h3>
          <input
            className="passinput"
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="**********"
            minLength={6}
          />
          <button className="loginbtn">Log in</button>
          <div className="googlecontainer">
            <p className="or">OR</p>
            <button className="googletext">
              <img className="google" src={google} alt="" /> sign up with Google
            </button>
          </div>
          <p className="signup">
            Don't have an account ?
            <Link to="/Signup" className="signupline">
              Register now
            </Link>
          </p>
        </form>
        <img className="aster" src={aster} alt="" />
        <img className="sllipse1" src={sllipse1} alt="" />
      </div>
    </div>
  );
};

export default UserLogin;
