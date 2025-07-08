import { useEffect, useState, useRef } from "react";
import { socket } from "../App";
import { v4 as uuidv4 } from "uuid";

export default function ChatRoom() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateMessages, setPrivateMessages] = useState({});
  const [reactions, setReactions] = useState({});
  const [notifications, setNotifications] = useState([]);
  const isTyping = useRef(false);
  const typingTimeout = useRef(null);

  useEffect(() => {
    const name = prompt("Enter your name:");
    setUsername(name || "Anonymous");
    socket.emit("set username", name || "Anonymous");

    socket.on("chat message", (data) => {
      setMessages((prev) => [...prev, { ...data, id: uuidv4() }]);
    });

    socket.on("user list", (userList) => {
      setUsers(userList);
    });

    socket.on("private message", ({ from, message, timestamp }) => {
      setPrivateMessages((prev) => {
        const msgs = prev[from] || [];
        return {
          ...prev,
          [from]: [...msgs, { from, message, timestamp }],
        };
      });
    });

    socket.on("message reaction", ({ messageId, emoji, username }) => {
      setReactions((prev) => {
        const current = prev[messageId] || [];
        return {
          ...prev,
          [messageId]: [...current, { emoji, username }],
        };
      });
    });

    socket.on("notification", ({ type, username, timestamp }) => {
      setNotifications((prev) => [
        ...prev,
        { type, username, timestamp },
      ]);
    });

    return () => {
      socket.off("chat message");
      socket.off("user list");
      socket.off("private message");
      socket.off("message reaction");
      socket.off("notification");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const timestamp = new Date().toISOString();

    if (selectedUser) {
      socket.emit("private message", {
        to: selectedUser.id,
        from: username,
        message,
      });

      setPrivateMessages((prev) => {
        const msgs = prev[selectedUser.name] || [];
        return {
          ...prev,
          [selectedUser.name]: [...msgs, { from: username, message, timestamp }],
        };
      });
    } else {
      socket.emit("chat message", {
        username,
        message,
        timestamp,
      });
    }

    setMessage("");
    socket.emit("stop typing");
    isTyping.current = false;
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!isTyping.current) {
      isTyping.current = true;
      socket.emit("typing", username);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      isTyping.current = false;
      socket.emit("stop typing");
    }, 1500);
  };

  const reactToMessage = (messageId, emoji) => {
    socket.emit("message reaction", { messageId, emoji, username });
  };

  const displayedMessages = selectedUser
    ? privateMessages[selectedUser.name] || []
    : messages;

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      {/* Sidebar */}
      <div style={{ width: "25%", borderRight: "1px solid #ccc", padding: 10 }}>
        <h4>Online Users</h4>
        {users
          .filter((u) => u.name !== username)
          .map((user) => (
            <div
              key={user.id}
              style={{
                cursor: "pointer",
                background: selectedUser?.id === user.id ? "#eee" : "transparent",
                padding: 5,
              }}
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </div>
          ))}
        <hr />
        <button onClick={() => setSelectedUser(null)}>Global Chat</button>
      </div>

      {/* Chat Panel */}
      <div style={{ width: "75%", padding: 10 }}>
        <h2>{selectedUser ? `Private chat with ${selectedUser.name}` : "Global Chat Room"}</h2>

        <div
          style={{
            maxHeight: "70vh",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          {/* Show notifications (join/leave) */}
          {notifications.map((note, i) => (
            <div key={`notif-${i}`} style={{ fontStyle: "italic", color: "#888" }}>
              {note.username} {note.type === "join" ? "joined" : "left"} the chat
            </div>
          ))}

          {/* Show chat messages */}
          {displayedMessages.map((msg, i) => (
            <div key={msg.id || i} style={{ marginBottom: 10 }}>
              <strong>{msg.from || msg.username}</strong>: {msg.message}
              <div style={{ fontSize: "0.7em", color: "#888" }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>

              {/* Emoji Reactions */}
              {!selectedUser && (
                <>
                  <div style={{ marginTop: 5 }}>
                    {["👍", "❤️", "😂", "😲"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => reactToMessage(msg.id, emoji)}
                        style={{ marginRight: 5 }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Display reactions */}
                  <div style={{ fontSize: "0.8em", color: "#555", marginTop: 3 }}>
                    {(reactions[msg.id] || []).map((r, index) => (
                      <span key={index}>
                        {r.username}: {r.emoji}{" "}
                      </span>
                    ))}
                  </div>
                </>
              )}
              <hr />
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage}>
          <input
            value={message}
            onChange={handleTyping}
            placeholder="Type your message"
            style={{ width: "80%", padding: 8 }}
          />
          <button type="submit" style={{ padding: 8 }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
