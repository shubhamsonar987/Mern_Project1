        <div className="cont"></div>
        <div className="flowcont">
          <div
            className={`flow ${selected === "flow" ? "active" : ""}`}
            onClick={() => handleClick("flow", formId)}
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
                  className="inputs1"
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
      <hr />

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

const [isShareEnabled, setIsShareEnabled] = useState(false);
const [isSharePopupVisible, setIsSharePopupVisible] = useState(false);
const [email, setEmail] = useState("");
const [role, setRole] = useState("edit");
const [selectedFolder, setSelectedFolder] = useState(null);
const [close, setClose] = useState(false);
const [selected, setSelected] = useState("res");
const [isDarkMode, setIsDarkMode] = useState(() => {
return localStorage.getItem("theme") === "dark";
});
