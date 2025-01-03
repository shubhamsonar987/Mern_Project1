import React from "react";
import { Link } from "react-router-dom";
import formbot from "../assets/Container-2.svg";
import mainimage from "../assets/Container-4.svg";
import image1 from "../assets/SVG.svg";
import image2 from "../assets/Clip path group.svg";
import arrow from "../assets/SVG-2.svg";
import "./start.css";

const Home = () => {
  return (
    <div className="start">
      {/* header container */}
      <div className="startcontainer">
        <div className="formbotcontainer">
          <img className="formbot" src={formbot} alt="" />
        </div>
        <div className="btncontainer">
          <button className="signinbtn">
            <Link className="text" to="/Login">
              Sign in
            </Link>
          </button>
          <button className="signupbtn">
            <Link className="text" to="/Signup">
              Create a FormBot
            </Link>
          </button>
        </div>
      </div>
      {/* middle portion all text with some styling icon container */}
      <div className="mainimagecontainer">
        <img src={image1} alt="" />

        <div className="maintext">
          <p className="p1">Build advanced chatbots visually</p>
          <p className="p2">
            Typebot gives you powerful blocks to create unique chat experiences.
            Embed them anywhere on your web/mobile apps and start collecting
            results like magic.
          </p>
          <button className="signupbtn1">
            <Link className="text" to="/Signup">
              Create a FormBot for free
            </Link>
          </button>
        </div>
        <img src={image2} alt="" />
      </div>
      {/* big image container */}
      <div>
        <img className="bigimagecontainer" src={mainimage} alt="" />
      </div>
      {/* footer container */}
      <div className="footercontainer">
        <div className="container1">
          <img src={formbot} alt="" />
          <p>
            Made with ❤️ by <span>@cuvette</span>
          </p>
        </div>
        <div className="container2">
          <p className="header">Product</p>
          <div>
            <p>
              Status <img src={arrow} alt="" />
            </p>
            <p>
              Documentation <img src={arrow} alt="" />
            </p>
            <p>
              Roadmap <img src={arrow} alt="" />
            </p>
            <p>
              Pricing <img src={arrow} alt="" />
            </p>
          </div>
        </div>
        <div className="container3">
          <p className="header">Community</p>
          <div>
            <p>
              Discord <img src={arrow} alt="" />
            </p>
            <p>
              GitHub repository <img src={arrow} alt="" />
            </p>
            <p>
              Twitter <img src={arrow} alt="" />
            </p>
            <p>
              LinkedIn <img src={arrow} alt="" />
            </p>
            <p>
              OSS Friends
              <img src={arrow} alt="" />
            </p>
          </div>
        </div>
        <div className="container4">
          <p className="header">Company</p>
          <div>
            <p>
              About <img src={arrow} alt="" />
            </p>
            <p>
              Contact <img src={arrow} alt="" />
            </p>
            <p>
              Terms of Service <img src={arrow} alt="" />
            </p>
            <p>
              Privacy Policy <img src={arrow} alt="" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
