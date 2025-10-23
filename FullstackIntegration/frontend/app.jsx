import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

// Connect to backend server
const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    // Listen for messages from backend
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && name.trim()) {
      const data = {
        name,
        message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit("send_message", data);
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <h2>💬 Real-Time Chat App</h2>

      {!name ? (
        <div style={styles.nameBox}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      ) : (
        <>
          <div style={styles.chatBox}>
            {chat.map((msg, index) => (
              <p key={index}>
                <strong>{msg.name}</strong> [{msg.time}]: {msg.message}
              </p>
            ))}
          </div>

          <form onSubmit={sendMessage} style={styles.form}>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "400px",
    margin: "50px auto",
    border: "2px solid #333",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  chatBox: {
    height: "300px",
    overflowY: "scroll",
    border: "1px solid #aaa",
    padding: "10px",
    marginBottom: "10px",
    textAlign: "left",
    backgroundColor: "white",
  },
  form: {
    display: "flex",
    gap: "5px",
  },
  nameBox: {
    display: "flex",
    justifyContent: "center",
  },
};

export default App;
