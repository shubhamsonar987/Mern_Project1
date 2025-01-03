import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Workspace.css";
import ThemeToggle from "./themeChanger";
import closed from "../assets/loginAssets/close.svg";
import message from "../assets/bubbles/Vector (2).svg";
import photo from "../assets/bubbles/SVG (3).svg";
import video from "../assets/bubbles/SVG (4).svg";
import GIF from "../assets/bubbles/gif.svg";
import text from "../assets/bubbles/text.svg";
import phone from "../assets/bubbles/phone.svg";
import number from "../assets/bubbles/number.svg";
import emails from "../assets/bubbles/email.svg";
import date from "../assets/bubbles/date.svg";
import rating from "../assets/bubbles/rating.svg";
import button from "../assets/bubbles/button.svg";
import flag from "../assets/bubbles/Vector (1).svg";
import deletes from "../assets/delete.svg";

const workspace = () => {
  const { fileId } = useParams(); // Extract fileId from the route
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [selected, setSelected] = useState("flow");
  const [close, setClose] = useState(false);
  const [addedComponents, setAddedComponents] = useState([]);
  const [data, setData] = useState({
    formname: "",
    bubble_text: "",
    text: "",
    image: "",
    number: "",
    email: "",
    phone: "",
    rating: "",
    date: "",
    button: "",
  });
  const [isShareEnabled, setIsShareEnabled] = useState(false);
  const [isSharePopupVisible, setIsSharePopupVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("edit");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const handleSave1 = () => {
    setIsShareEnabled(true); // Enable the Share button
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      return !prev;
    });

    const homeElement = document.querySelector(".header");
    const hrdown = document.querySelector(".cona");
    const elem = document.querySelector(".hrcontainer");
    const inputss = document.querySelector(".inputs");
    const bubblesd = document.querySelectorAll(".content");
    const bubbles1 = document.querySelectorAll(".contents");
    const bubbles2 = document.querySelectorAll(".contents1");
    const inputs1 = document.querySelectorAll(".inputs11");

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
    if (hrdown) {
      if (isDarkMode) {
        hrdown.style.backgroundColor = "#282c34";
        hrdown.style.color = "white";
      } else {
        hrdown.style.backgroundColor = "white";
        hrdown.style.color = "black";
      }
    } else {
      console.warn("Element with class 'home' not found.");
    }

    if (inputss) {
      if (isDarkMode) {
        inputss.style.backgroundColor = "#282c34";
        inputss.style.color = "white"; // You might want to change text color for visibility
      } else {
        inputss.style.backgroundColor = "transparent";
        inputss.style.border = "solid 1px #282c34";
        inputss.style.borderRadius = "0.4rem";
        inputss.style.color = "black";
      }
    } else {
      console.warn("Element with class 'inputs' not found.");
    }
    if (elem) {
      if (isDarkMode) {
        elem.style.backgroundColor = "#18181b";
        elem.style.color = "white"; // You might want to change text color for visibility
      } else {
        elem.style.backgroundColor = "transparent";
        elem.style.border = "solid 1px #282c34";
        elem.style.borderRadius = "0.4rem";
        elem.style.color = "black";
      }
    } else {
      console.warn("Element with class 'inputs' not found.");
    }

    if (bubblesd) {
      bubblesd.forEach((bubble) => {
        if (isDarkMode) {
          bubble.style.backgroundColor = "#282c34";
          bubble.style.color = "white";
        } else {
          bubble.style.backgroundColor = "transparent";
          bubble.style.color = "black";
          bubble.style.border = "solid 1px #282c34";
          bubble.style.borderRadius = "0.4rem";
        }
      });
    } else {
      console.warn("Elements with class 'content' not found.");
    }
    if (bubbles2) {
      bubbles2.forEach((bubble) => {
        if (isDarkMode) {
          bubble.style.backgroundColor = "#18181b";
          bubble.style.color = "white";
        } else {
          bubble.style.backgroundColor = "transparent";
          bubble.style.color = "black";
          bubble.style.border = "solid 1px #282c34";
          bubble.style.borderRadius = "0.4rem";
        }
      });
    } else {
      console.warn("Elements with class 'content' not found.");
    }
    if (bubbles1) {
      bubbles1.forEach((bubble) => {
        if (isDarkMode) {
          bubble.style.backgroundColor = "#18181b";
          bubble.style.color = "white";
        } else {
          bubble.style.backgroundColor = "transparent";
          bubble.style.color = "black";
          bubble.style.border = "solid 1px #282c34";
          bubble.style.borderRadius = "0.4rem";
        }
      });
    } else {
      console.warn("Elements with class 'content' not found.");
    }
    if (inputs1.length > 0) {
      inputs1.forEach((input) => {
        if (isDarkMode) {
          input.style.backgroundColor = "#282c34";
          input.style.color = "white";
        } else {
          input.style.backgroundColor = "transparent";
          input.style.border = "solid 1px #282c34";
          input.style.borderRadius = "0.4rem";
          input.style.color = "black";
        }
      });
    } else {
      console.warn("Elements with class 'inputs11' not found.");
    }
  };

  const handleComponentClick = (componentName) => {
    setAddedComponents((prev) => [
      ...prev,
      { name: componentName, id: Date.now(), value: "", error: false },
    ]);
  };

  const handleDeleteComponent = async (componentName) => {
    try {
      // console.log("Deleting component:", componentName);

      if (!fileId) {
        alert("File ID is missing.");
        return;
      }

      // Make the API call to delete the component
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/folders/${fileId}/form/${componentName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the state to remove the deleted component from the UI
        setAddedComponents((prev) =>
          prev.filter(
            (component) => component.name.toLowerCase() !== componentName
          )
        );
        // alert("Component deleted successfully.");
      } else {
        alert(response.data.message || "Failed to delete the component.");
      }
    } catch (error) {
      alert("Failed to delete the component.", error);
    }
  };

  const handleInputChange = (id, value) => {
    // console.log(`Input Change: ID=${id}, Value=${value}`); // Log input changes
    setAddedComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, value, error: value.trim() === "" } : comp
      )
    );

    const updatedComponent = addedComponents.find((comp) => comp.id === id);
    if (updatedComponent) {
      setData((prevData) => ({
        ...prevData,
        [updatedComponent.name.toLowerCase()]: value,
      }));
      // console.log("Updated Data State:", {
      //   ...data,
      //   [updatedComponent.name.toLowerCase()]: value,
      // });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const groupedData = addedComponents.reduce((acc, comp) => {
      const key = comp.name.toLowerCase();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(comp.value);
      return acc;
    }, {});

    // Ensure `formname` is included
    const formattedData = {
      file: fileId,
      formname: data.formname || "", // Include formname from state
      ...groupedData,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/folder/${fileId}/form`,
        formattedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 201) {
        console.log("Form saved successfully:", response.data);
      }
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  const handleBlur = (id, value) => {
    setAddedComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, error: value.trim() === "" } : comp
      )
    );
  };

  const handleClick = (type) => {
    if (type === "res") {
      if (!fileId) {
        alert("Form ID is missing.");
        return;
      }

      // Navigate to the response route and pass save state
      navigate(`/Workspace/${fileId}/response/${fileId}`, {
        state: { isDataAvailable }, // Pass data availability status
      });
    }
  };

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

  const handlecontent = () => {
    console.log("Handlecontent function triggered.");
    if (!fileId) {
      alert("File ID is missing. Cannot proceed.");
      return;
    }
    console.log("Navigating to Workspace with File ID:", fileId);
    navigate(`/Formbot/${fileId}`);
  };
  const handleFileUpload = (id, files) => {
    const uploadedFile = files[0]; // Assuming single file upload
    console.log("Uploaded file:", uploadedFile);

    setAddedComponents((prev) =>
      prev.map((comp) =>
        comp.id === id
          ? { ...comp, value: uploadedFile.name, error: !uploadedFile }
          : comp
      )
    );

    // You can also store the file object itself in state if needed for backend upload
  };

  const handleSharePopupOpen = () => setIsSharePopupVisible(true);
  const handleSharePopupClose = () =>
    setIsSharePopupVisible(!isSharePopupVisible);

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/user/folders/${fileId}/forms`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const formData = response.data.form;

        if (formData) {
          // Set formname directly in the state
          setData((prevData) => ({
            ...prevData,
            formname: formData.formname || "",
          }));

          // Filter out unwanted keys and set added components
          const filteredData = Object.entries(formData).filter(
            ([key]) =>
              ![
                "_id",
                "__v",
                "file",
                "user",
                "createdAt",
                "updatedAt",
              ].includes(key)
          );

          const structuredComponents = filteredData.flatMap(([key, values]) => {
            if (Array.isArray(values)) {
              return values.map((value) => ({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                id: Date.now() + Math.random(),
                value,
              }));
            }
            return [
              {
                name: key.charAt(0).toUpperCase() + key.slice(1),
                id: Date.now() + Math.random(),
                value: values,
              },
            ];
          });

          setAddedComponents(structuredComponents);
        }
      } catch (error) {
        console.error("Error fetching file data:", error);
      }
    };

    fetchFileData();
  }, [fileId]);

  const handleclose = () => {
    setClose(true);
    if (close == true) {
      navigate("/home");
    }
  };

  return (
    <div className="home">
      <div className="header">
        <div className="cont">
          <div className="inputtext">
            <input
              id="formname"
              value={data.formname || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                console.log("Formname Input Value:", newValue); // Debug log
                setData((prevData) => ({
                  ...prevData,
                  formname: newValue,
                }));
              }}
              className="inputs"
              type="text"
              placeholder={data.formname || "Enter Form Name"}
            />
          </div>
        </div>
        <div className="flowcont">
          <div
            className={`flow ${selected === "flow" ? "active" : ""}`}
            onClick={() => handleClick("flow")}
          >
            Flow
          </div>
          <div
            className={`res ${selected === "res" ? "active" : ""}`}
            onClick={() => handleClick("res")}
          >
            Response
          </div>
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
              disabled={!isShareEnabled}
              style={{
                backgroundColor: isShareEnabled ? "#1a5fff" : "#848890",
                cursor: isShareEnabled ? "pointer" : "not-allowed",
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
              onClick={(e) => {
                handleSave(e);
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
      <div className="cona">
        <div>
          <div className="hrcontainer">
            <div>
              <div className="bubblecont">Bubbles</div>
              <div className="bubbles">
                <div
                  className="content"
                  onClick={() => handleComponentClick("Bubble_text")}
                >
                  <img src={message} alt="" />
                  Text
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Image")}
                >
                  <img src={photo} alt="" />
                  Image
                </div>
                <div className="content">
                  <img src={video} alt="" />
                  video
                </div>
                <div className="content">
                  <img className="gif" src={GIF} alt="" /> GIF
                </div>
              </div>
            </div>
            <div>
              <div className="bubblecont">Inputs</div>
              <div className="bubbles">
                <div
                  className="content"
                  onClick={() => handleComponentClick("Text")}
                >
                  <img src={text} alt="" />
                  Text
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Number")}
                >
                  <img src={number} alt="" />
                  Number
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Email")}
                >
                  <img src={emails} alt="" />
                  Email
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Phone")}
                >
                  <img src={phone} alt="" /> Phone
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Date")}
                >
                  <img src={date} alt="" /> Date
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Rating")}
                >
                  <img src={rating} alt="" /> Rating
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Button")}
                >
                  <img src={button} alt="" /> Button
                </div>
              </div>
            </div>
          </div>
          <div className="allinputs">
            <button
              className="contents"
              onClick={() => {
                handlecontent();
              }}
            >
              <img src={flag} alt="" className="list" />
              Start
            </button>

            <div className="allinputs1">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1rem",
                }}
              >
                {addedComponents.map((comp) => {
                  const inputType = [
                    "Image",
                    "Button",
                    "Bubble_text",
                    "Number",
                  ].includes(comp.name)
                    ? "text"
                    : comp.name.toLowerCase();

                  return (
                    <div className="contents1" key={comp.id}>
                      <span>{comp.name}</span>
                      {inputType === "file" ? (
                        <input
                          className="inputs11"
                          type="file"
                          onChange={(e) =>
                            handleFileUpload(comp.id, e.target.files)
                          }
                          style={{
                            borderColor: comp.error ? "red" : "#282c34",
                          }}
                        />
                      ) : (
                        <input
                          className="inputs11"
                          type={inputType?.toLowerCase() || "text"}
                          value={comp.value || ""}
                          placeholder={`Enter details for ${comp.name}`}
                          onChange={(e) =>
                            handleInputChange(comp.id, e.target.value)
                          }
                          onBlur={(e) => handleBlur(comp.id, e.target.value)}
                          style={{
                            borderColor: comp.error ? "red" : "#282c34",
                          }}
                        />
                      )}
                      {comp.error && (
                        <p className="error-text">Required Field</p>
                      )}
                      <img
                        className="delete"
                        src={deletes}
                        alt="Delete"
                        onClick={() =>
                          handleDeleteComponent(comp.name.toLowerCase())
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default workspace;
