import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import send from "../assets/bubbles/send.svg";
import "./Formbot.modular.css";

const Formbot = () => {
  const { fileId } = useParams();
  const [formbot, setFormbot] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [bubbleQueue, setBubbleQueue] = useState([]);
  const [placeholderQueue, setPlaceholderQueue] = useState([]);
  const [responses, setResponses] = useState({});
  const [isChatComplete, setIsChatComplete] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    "Type your answer..."
  );

  useEffect(() => {
    // Track page visits and send "1 view" to backend
    const visitTimestamp = new Date().toISOString();
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/user/page-visit`, {
        fileId,
        status: "1view",
        timestamp: visitTimestamp,
      })
      .catch((error) => console.error("Error logging page visit:", error));

    // Handle incomplete form submission when the user leaves
    const handlePageLeave = () => {
      if (!isChatComplete) {
        const leaveTimestamp = new Date().toISOString();
        axios
          .post(`${import.meta.env.VITE_BACKEND_URL}/api/user/form-status`, {
            fileId,
            status: "incomplete",
            timestamp: leaveTimestamp,
          })
          .catch((error) =>
            console.error("Error logging incomplete status:", error)
          );
      }
    };

    window.addEventListener("beforeunload", handlePageLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handlePageLeave();
      }
    });

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("beforeunload", handlePageLeave);
      document.removeEventListener("visibilitychange", handlePageLeave);
    };
  }, [fileId, isChatComplete]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/folders/${fileId}/form`
      )
      .then((response) => {
        const form = response.data.form;
        const bubbleTexts = form?.bubble_text || [];
        const images = form?.image || [];
        const otherData = [
          { key: "text", value: form?.text?.[0] || "" },
          { key: "number", value: form?.number?.[0] || "" },
          { key: "email", value: form?.email?.[0] || "" },
          { key: "phone", value: form?.phone?.[0] || "" },
          { key: "date", value: form?.date?.[0] || "" },
          { key: "rating", value: form?.rating?.[0] || "" },
          { key: "button", value: form?.button?.[0] || "" },
        ].filter(({ value }) => value);

        const bubbles = [
          ...bubbleTexts.map((text) => ({
            type: "bubble_text",
            content: text,
          })),
          ...images.map((image) => ({ type: "image", content: image })),
        ];

        setFormbot(form);
        setBubbleQueue(bubbles);
        setPlaceholderQueue(otherData);

        if (bubbles.length > 0) {
          setMessages([
            { sender: "bot", text: "Welcome! Let's get started." },
            { sender: "bot", text: bubbles[0]?.content },
          ]);
        }
      })
      .catch((error) => {
        console.error("Error fetching form data:", error);
      });
  }, [fileId]);

  const sendMessage = () => {
    if (input.trim() === "" || isChatComplete) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    if (bubbleQueue.length > 0) {
      const currentBubble = bubbleQueue[0];
      setResponses((prev) => ({
        ...prev,
        [currentBubble.type]: [
          ...(prev[currentBubble.type] || []),
          { content: currentBubble.content, answer: input },
        ],
      }));
    } else if (placeholderQueue.length > 0) {
      const currentPlaceholder = placeholderQueue[0];
      setResponses((prev) => ({
        ...prev,
        [currentPlaceholder.key]: input,
      }));
    }

    setInput("");
    setIsBotTyping(true);

    setTimeout(() => {
      if (bubbleQueue.length > 1) {
        const nextBubble = bubbleQueue[1];
        setBubbleQueue((prev) => prev.slice(1));

        if (nextBubble.type === "bubble_text") {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: nextBubble.content },
          ]);
        } else if (nextBubble.type === "image") {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Here is an image:",
              image: nextBubble.content,
            },
          ]);
        }
      } else if (bubbleQueue.length === 1) {
        setBubbleQueue([]);
        if (placeholderQueue.length > 0) {
          const nextPlaceholder = placeholderQueue[0];
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: `Please provide your Other Details.`,
            },
          ]);
          setCurrentPlaceholder(nextPlaceholder.value);
        }
      } else if (placeholderQueue.length > 1) {
        setPlaceholderQueue((prev) => prev.slice(1));
        const nextPlaceholder = placeholderQueue[1];
        setCurrentPlaceholder(nextPlaceholder.value);
      } else {
        const finalResponses = {
          ...responses,
          fileId,
          timestamp: new Date().toISOString(),
          status: "completed",
        };

        saveResponsesToFile(finalResponses);
        sendResponsesToBackend(finalResponses);

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Thank you for completing the form!" },
        ]);
        setIsChatComplete(true);
      }
      setIsBotTyping(false);
    }, 1500);
  };

  const saveResponsesToFile = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "responses.json";
    link.click();
  };

  const sendResponsesToBackend = async (data) => {
    try {
      // Filter out empty responses
      const filteredResponses = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value && value.length > 0)
      );

      console.log("Sending filtered responses to backend:", filteredResponses);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/Formbot/${fileId}`,
        { replies: filteredResponses }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Responses successfully sent to backend.", response.data);
      } else {
        console.error(
          "Failed to send responses to backend. Status:",
          response.status
        );
      }
    } catch (error) {
      console.error(
        "Error sending responses to backend:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="contain">
      <div className="chatWindow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="message"
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor:
                msg.sender === "user" ? "#ff8e21" : "rgb(237, 237, 237)",
              color: msg.sender === "user" ? "white" : "black",
              margin: msg.sender === "user" ? "0 2rem 0 0" : "0 0 0 2rem",
              ...(window.innerWidth <= 768 && {
                margin: msg.sender === "user" ? "0 5px 0 0" : "0 0 0 5px",
                padding: msg.sender === "user" ? "10px 15px" : "10px 15px",
              }),
            }}
          >
            {msg.text}
            {msg.image && (
              <img src={msg.image} alt="Form Image" className="image" />
            )}
          </div>
        ))}
        {isBotTyping && (
          <div
            className="message"
            style={{
              alignSelf: "flex-start",
              margin: "0 0 0 2rem",
              ...(window.innerWidth <= 768 && { margin: "0 0 0 5px" }),
            }}
          >
            Bot is typing...
          </div>
        )}
      </div>
      <div className="inputContainer">
        {(() => {
          let inputType =
            placeholderQueue.length > 0 ? placeholderQueue[0].key : "text";

          switch (inputType) {
            case "text":
            case "bubble_text":
            case "image":
            case "button":
            case "email":
              return (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentPlaceholder || "Enter your text"}
                  className="input"
                />
              );
            case "phone":
            case "number":
              return (
                <input
                  type="number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentPlaceholder || "Enter a number"}
                  className="input"
                />
              );
            case "date":
              return (
                <input
                  type="date"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="input"
                />
              );
            case "rating":
              return (
                <div className="inputs1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="ratingButton"
                      onClick={() => setInput(String(rating))}
                      style={{
                        padding: "0.5rem 1rem",
                        margin: "0.2rem",
                        height: "40px",
                        border: "1px solid #ccc",
                        borderRadius: "100%",
                        backgroundColor:
                          rating === Number(input) ? "#ff8e21" : "#007bff",
                        color: rating === Number(input) ? "white" : "white",
                      }}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              );
            default:
              return null;
          }
        })()}
        <button className="button" onClick={sendMessage}>
          <img src={send} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Formbot;
