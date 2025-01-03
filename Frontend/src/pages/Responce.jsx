import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./themeChanger";
import moment from "moment";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);
import axios from "axios";
import closed from "../assets/loginAssets/close.svg";
import "./Responce.css";

const Response = () => {
  const token = localStorage.getItem("token");
  const { formId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [save, setSave] = useState([]);
  const [incomplete, setIncomplete] = useState([]); // Incomplete data
  const [viewscount, setViewscount] = useState([]); // Views data
  const [isSharePopupVisible, setIsSharePopupVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("edit");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [close, setClose] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      return !prev;
    });

    const homeElement = document.querySelector(".header");
    const homeElement1 = document.querySelector(".body");
    const homeElement2 = document.querySelector(".body1");

    if (homeElement) {
      if (isDarkMode) {
        homeElement.style.backgroundColor = "#18181b";
        homeElement.style.color = "white";
      } else {
        homeElement.style.backgroundColor = "white";
        homeElement.style.color = "black";
      }
    } else {
      console.warn("Element with class 'home' not found.");
    }
    if (homeElement1) {
      if (isDarkMode) {
        homeElement1.style.backgroundColor = "#18181b";
        homeElement1.style.color = "white";
      } else {
        homeElement1.style.backgroundColor = "white";
        homeElement1.style.color = "black";
      }
    } else {
      console.warn("Element with class 'home' not found.");
    }
    if (homeElement2) {
      if (isDarkMode) {
        homeElement2.style.backgroundColor = "#18181b";
        homeElement2.style.color = "white";
      } else {
        homeElement2.style.backgroundColor = "white";
        homeElement2.style.color = "black";
      }
    } else {
      console.warn("Element with class 'home' not found.");
    }
  };

  useEffect(() => {
    if (formId) {
      fetchResponseData();
    }
  }, [formId]);

  const fetchResponseData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/${formId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSave(response.data);
      // console.log("Fetched data:", response.data); // Debug the fetched data

      if (Array.isArray(response.data) && response.data.length > 0) {
        // Process the backend data
        const replies = response.data.map((item) => ({
          date: item.timestamp || "N/A",
          question: item.text || "N/A",
          bubble: item.bubble_text
            .map((bubble) => `${bubble.content}: ${bubble.answer}`)
            .join(", "),
          image: item.image
            .map((img) => `${img.content}: ${img.answer}`)
            .join(", "),
          email: item.email || "N/A",
          phone: item.phone || "N/A",
          rating: item.rating || "N/A",
          status: item.status || "N/A",
        }));

        // console.log("Processed replies for state:", replies); // Debug processed replies
        setData(replies); // Update the state with the processed data
      } else {
        // console.warn("No valid data received from backend.");
        setData([]); // Reset state if no data
      }
    } catch (error) {
      // console.error("Error fetching response data:", error);
      setData([]); // Reset state on error
    }
  };

  const fetchviews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/page-visit/${formId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        // Assuming the response contains the array of visits directly
        setViewscount(response.data); // Set the full array to state
        // console.log("Views data:", response.data);
      } else {
        console.warn("Unexpected response status:", response.status);
        setViewscount([]); // Reset the state if no valid data is received
      }
    } catch (error) {
      console.error("Error fetching views data:", error);
      setViewscount([]); // Reset state on error
    }
  };

  const fetchincomplete = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/form-status/${formId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log("Incomplete response:", response.data); // Debug
      setIncomplete(response.data); // Set the incomplete data to state
    } catch (error) {
      // console.error("Error fetching incomplete data:", error);
    }
  };

  useEffect(() => {
    if (formId) {
      fetchviews();
      fetchincomplete();
    }
  }, [formId]);

  const handleclose = () => {
    setClose(true);
    if (close == true) {
      navigate("/home");
    }
  };

  const handleClick = (type) => {
    if (type === "flow") {
      if (!formId) {
        alert("Form ID is missing.");
        return;
      }

      // Navigate to the response route and pass save state
      navigate(-1);
    }
  };

  const handleSharePopupOpen = () => setIsSharePopupVisible(true);
  const handleSharePopupClose = () =>
    setIsSharePopupVisible(!isSharePopupVisible);

  const handleShareLink = async (dashBoardId, role) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/${dashBoardId}/shareLink`,
        { role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        navigator.clipboard.writeText(response.data.sharingLink); // Copy link to clipboard
        alert("Share Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error creating share link:", error);
      alert(error.response?.data?.message || "Failed to create share link.");
    }
  };

  const handleShareEmail = async (dashBoardId, email, role) => {
    if (!email || !role) {
      alert("Please enter a valid email and select a role.");
      return;
    }

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/${dashBoardId}/shareEmail`,
        { email, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("Email shared successfully!");
        setEmail(""); // Clear input field
      }
    } catch (error) {
      console.error("Error sharing email:", error);
      alert(error.response?.data?.message || "Failed to share via email.");
    }
  };

  const validSave = Array.isArray(save) ? save : [];
  const validSaveLength = validSave.length;

  const validIncomplete = Array.isArray(incomplete) ? incomplete : [];
  const validIncompleteLength = validIncomplete.length;

  const starts1 = validSaveLength + validIncompleteLength;
  const completionRate =
    starts1 > 0 ? Math.round((validSaveLength / starts1) * 100) : 0;

  const chartData = {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        data: [validSaveLength, starts1 - validSaveLength],
        backgroundColor: ["#007BFF", "#D3D3D3"], // Blue for completed, grey for incomplete
        hoverBackgroundColor: ["#0056b3", "#A9A9A9"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="body">
      <div className="header">
        <div className="cont"></div>
        <div className="flowcont">
          <div className={`flow`} onClick={() => navigate(-1)}>
            Flow
          </div>
          <div className={`res active`}>Response</div>
        </div>
        <div className="toggle">
          <div className="light">Light</div>
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

          <div className="dark">Dark</div>
        </div>
        <div className="buttonshare">
          <div className="savenshare">
            {/* Share Button */}
            <button
              className="btn"
              style={{
                backgroundColor: "#1a5fff",
                cursor: "pointer",
                color: "white",
              }}
              onClick={handleSharePopupOpen} // Open the share popup on click
            >
              Share
            </button>

            {/* Share Popup */}
            {isSharePopupVisible && (
              <div className="sharecont">
                <img
                  className="close"
                  src={closed}
                  alt="Close"
                  onClick={handleSharePopupClose}
                />
                {/* Email Sharing */}
                <div className="emailcont">
                  <p className="emailinv">Invite by Email</p>
                  <select
                    className="dd"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="edit">Edit</option>
                    <option value="view">View</option>
                  </select>
                </div>
                <input
                  type="email"
                  className="inputs12"
                  value={email}
                  placeholder="Enter email Id"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="copy"
                  onClick={() => handleShareEmail(selectedFolder, email, role)}
                >
                  Send Invite
                </button>

                {/* Link Sharing */}
                <p className="linkinv">Invite by link</p>
                <button
                  className="copy1"
                  onClick={() => handleShareLink(selectedFolder, role)}
                >
                  Copy link
                </button>
              </div>
            )}

            {/* Save Button */}
            <button
              className="btn1"
              onClick={() => {
                handleSave1(); // Enable the Share button
              }}
            >
              Save
            </button>
          </div>
          <div
            className="close"
            onClick={() => {
              handleclose();
            }}
          >
            <img src={closed} alt="" />
          </div>
        </div>
      </div>
      <span />
      {save.length || validIncompleteLength > 1 ? (
        <>
          <div className="body1">
            <div className="views">
              Views
              <div className="viewscount">{viewscount?.length || 0}</div>
            </div>
            <div className="starts">
              Starts
              <div className="startscount">
                {save?.length && incomplete?.length
                  ? incomplete.length + save.length
                  : 0}
              </div>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {/* Dynamically generate table headers */}
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => (
                      <th key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {/* Dynamically generate table rows */}
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Doughnut Chart */}
          <div className="containers">
            <div className="chart">
              <Doughnut data={chartData} />
            </div>

            <div className="completed">
              completed <br /> <span>{validSaveLength}</span>
            </div>
            <div className="completerate">
              Completion rate
              <br />
              {completionRate}%
            </div>
          </div>
          <span className="textofscroll">
            scroll ⬆️ ⬇️ and ➡ ⬅ for viewing all details of table.
          </span>
        </>
      ) : (
        <div className="body">
          <p className="letssee" style={{ color: "#696969" }}>
            No Response yet collected
          </p>
        </div>
      )}
    </div>
  );
};

export default Response;
