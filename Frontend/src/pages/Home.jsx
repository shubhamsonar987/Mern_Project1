import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import blue from "../assets/loginAssets/1toggle.svg";
import blue1 from "../assets/loginAssets/Toggle.svg";
import down from "../assets/loginAssets/Vector (1).svg";
import createlogo from "../assets/SVG (1).svg";
import delete1 from "../assets/delete.svg";
import plusicon from "../assets/SVG (2).svg";
import close from "../assets/loginAssets/close.svg";
import ThemeToggle from "./themeChanger";

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [isFolder, setIsFolder] = useState(false);
  const [isFolder1, setIsFolder1] = useState(false);
  const [deleteFilePopup, setDeleteFilePopup] = useState(null);
  const [deleteFolderPopup, setDeleteFolderPopup] = useState(null);
  const [foldername, setFoldername] = useState("");
  const [filename, setFilename] = useState("");
  const [fileGetname, setFileGetname] = useState([]);
  const [folderData, setFolderData] = useState([]);
  const [toggledown, setToggledown] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [createdFileId, setCreatedFileId] = useState(null);
  const [isSharePopupVisible, setIsSharePopupVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("edit");
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

    const homeElement = document.querySelector(".home"); // Select the element
    if (isDarkMode) {
      homeElement.style.backgroundColor = "black"; // Set background color
      homeElement.style.color = "white"; // Set text color
    } else {
      homeElement.style.backgroundColor = "white"; // Set background color
      homeElement.style.color = "black";
    }
    const containerElement = document.querySelector(".container");
    if (isDarkMode) {
      containerElement.style.backgroundColor = "black"; // Set background color
    } else {
      containerElement.style.backgroundColor = "white"; // Set background color
    }
  };

  // Handlers for showing and hiding the popup
  const handleSharePopupOpen = () => setIsSharePopupVisible(true);
  const handleSharePopupClose = () =>
    setIsSharePopupVisible(!isSharePopupVisible);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const handlecreateclick = () => {
    setIsFolder((prev) => !prev);
  };
  const handlecreateclick1 = () => {
    setIsFolder1((prev) => !prev);
  };
  const submitform = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault(); // Prevent default only if e is provided
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/folder`, // Ensure the API endpoint is correct
        { foldername }, // Use the foldername directly from the state
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Check for success status code
        console.log("Folder created successfully:", response.data.folder);
        fetchform(); // Refresh the folder list after creation
        // alert("Folder created successfully");
        setIsFolder(false); // Close popup
        setFoldername(""); // Reset input field
      }
    } catch (error) {
      if (error.response) {
        // Handle server-side error responses
        alert(error.response.data.message || "Something went wrong!");
      } else if (error.request) {
        // Handle client-side or network errors
        alert("No response from the server. Please try again later.");
      } else {
        // Handle unexpected errors
        alert("An error occurred: " + error.message);
      }
    }
  };
  // State to store the file ID

  const submitform1 = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/folder/file`,
        { filename },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const newFileId = response.data.file._id; // Assuming the backend returns the file ID
        setCreatedFileId(newFileId); // Save the file ID
        console.log("File created successfully. File ID:", newFileId);

        fetchfile(); // Refresh file list
        // alert("File created successfully");
        setIsFolder1(false); // Close popup
        setFilename(""); // Reset input field
      }
    } catch (error) {
      console.error("Error creating file:", error);
      alert("Failed to create the file.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/setting`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setData(response.data.user);
    setLoading(false);
  };
  const fetchform = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/folders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setFolderData(response.data.folders);
  };

  const fetchfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/folders/file`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFileGetname(response.data.file);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/folder/${folderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // alert(response.data.message); // Notify the user
      fetchform(); // Refresh the folder list
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert(error.response?.data?.message || "Failed to delete the folder.");
    }
  };
  const deleteFile = async (fileId) => {
    // console.log("Deleting file with ID:", fileId); // Debug log
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/file/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Delete response:", response.data); // Debug log
      // alert(response.data.message);
      fetchfile(); // Refresh file list
    } catch (error) {
      console.error("Error deleting file:", error);
      alert(error.response?.data?.message || "Failed to delete the file.");
    }
  };

  const handleDeleteFolderPopup = (folderId) => {
    setDeleteFolderPopup(folderId); // Set the popup visibility for the specific folder
  };

  const closeDeleteFolderPopup = () => {
    setDeleteFolderPopup(null); // Close the popup
  };
  const handledeletefile = (fileId) => {
    setDeleteFilePopup(fileId); // Set the popup visibility for the specific file
  };

  const closeDeleteFilePopup = () => {
    setDeleteFilePopup(null); // Close the popup
  };
  const toogledown = () => {
    setToggledown((prev) => !prev);
  };
  const handleLogout = async () => {
    localStorage.removeItem("token");
    // alert("logout sucessful");
    navigate("/Login");
    window.location.reload;
  };
  const handleFolderClick = (folderId) => {
    setSelectedFolder(folderId === selectedFolder ? null : folderId); // Toggle selection
  };
  const handleFileClick = (fileId) => {
    setSelectedFile(fileId === selectedFile ? null : fileId); // Toggle selection
  };
  const gotoworkshop = (fileId) => {
    navigate(`/Workspace/${fileId}`);
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
  // const handleFolderClick = (folderId) => {
  //   setSelectedFolder(folderId === selectedFolder ? null : folderId); // Toggle selection
  // };

  useEffect(() => {
    fetchData();
    fetchform();
    fetchfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="home">
      <div className="container">
        <div className="profile">
          <div className="username">
            <span
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
              onClick={() => {
                toogledown();
              }}
            >
              <p className="username1">{data.username}'s workspace</p>
              <div className="downmenu">
                <img className="down" src={down} alt="" />
              </div>
            </span>
            <div className={`logouconatiner ${toggledown ? "visible" : ""}`}>
              <Link
                to="/User/Setting"
                style={{ textDecoration: "none", color: "white" }}
              >
                <div className="setting">Settings</div>
              </Link>
              <div
                className="logout"
                onClick={() => {
                  handleLogout();
                }}
              >
                Logout
              </div>
            </div>
          </div>
        </div>
        <div className="toggle">
          <div className="light">Light</div>
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <div className="dark">Dark</div>
        </div>
        <button className="btn" onClick={handleSharePopupOpen}>
          Share
        </button>

        {isSharePopupVisible && (
          <div className="sharecont">
            <img
              className="close"
              src={close}
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
      </div>
      <div className="folder">
        <div className="foldersname">
          <p className="foldercreate" onClick={() => handlecreateclick()}>
            <img src={createlogo} className="createlogo" alt="" />
            Create a folder
          </p>
          <div className={`foldercreateform ${isFolder ? "visible" : ""}`}>
            <p className="foldersCreatetext">Create New Folders</p>
            <input
              type="text"
              value={foldername}
              onChange={(e) => {
                setFoldername(e.target.value);
              }}
              placeholder="Enter folder name"
            />
            <div>
              <button
                className="done"
                onClick={(e) => {
                  submitform(e);
                }}
              >
                Done
              </button>
              <button
                onClick={() => {
                  setIsFolder(false);
                }}
                className="cancel"
              >
                Cancel
              </button>
            </div>
          </div>
          {folderData.map((folder) => (
            <span key={folder._id}>
              <p
                onClick={() => handleFolderClick(folder._id)}
                className="folders"
                style={{
                  backgroundColor:
                    selectedFolder === folder._id ? "white" : "#282c34",
                  color: selectedFolder === folder._id ? "black" : "white",
                }}
              >
                {folder.foldername}
                <img
                  className="delete1"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering folder selection
                    handleDeleteFolderPopup(folder._id);
                  }}
                  src={delete1}
                  alt="Delete"
                />
              </p>
              {deleteFolderPopup === folder._id && (
                <div className="folderdeletefrom visible">
                  <p className="foldersCreatetext">
                    Are you sure you want to delete this folder?
                  </p>
                  <div>
                    <button
                      className="done"
                      onClick={() => {
                        deleteFolder(folder._id);
                        closeDeleteFolderPopup();
                      }}
                    >
                      Done
                    </button>
                    <button
                      className="cancel"
                      onClick={() => closeDeleteFolderPopup()}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </span>
          ))}
        </div>
        <div>
          <div className="typebot">
            <div className="typebotname" onClick={() => handlecreateclick1()}>
              <img src={plusicon} alt="" />
              <div className="typebottext">Create a typebot</div>
            </div>
            <div className={`filecreateform ${isFolder1 ? "visible" : ""}`}>
              <p className="foldersCreatetext">Create New Files</p>
              <input
                type="text"
                value={filename}
                onChange={(e) => {
                  setFilename(e.target.value);
                }}
                placeholder="Enter File name"
              />
              <div>
                <button
                  className="done"
                  onClick={(e) => {
                    submitform1(e);
                    console.log("Done clicked");
                  }}
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    setIsFolder1(false);
                    console.log("cancel clicked");
                  }}
                  className="cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
            {fileGetname.map((file) => (
              <span key={file._id}>
                <div
                  onClick={() => handleFileClick(file._id)}
                  className={`formbotname ${
                    selectedFile === file._id ? "selected-file" : ""
                  }`}
                >
                  <div
                    className="formbottext"
                    onClick={() => gotoworkshop(file._id)}
                  >
                    <img
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering file selection
                        handledeletefile(file._id);
                      }}
                      src={delete1}
                      alt=""
                    />
                    <p className="typebottext1">{file.filename}</p>
                    {deleteFilePopup === file._id && (
                      <div className="filedeleteform visible">
                        <p className="foldersCreatetext">
                          Are you sure you want to delete this file?
                        </p>
                        <div>
                          <button
                            className="done"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering parent click
                              deleteFile(file._id);
                              closeDeleteFilePopup();
                            }}
                          >
                            Done
                          </button>
                          <button
                            className="cancel"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering parent click
                              closeDeleteFilePopup();
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
