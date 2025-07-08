# 📬 Real-Time Chat App with Socket.io

A full-stack real-time chat application built with the MERN stack and Socket.io. This app allows users to chat globally or privately, with live message reactions, user presence, and real-time updates.

---

## 🚀 Features

### ✅ Core Functionality

- Global chat room
- Private messaging between users
- Real-time message delivery
- Online/offline user status
- Typing indicators

### 🎯 Advanced Chat Features

- Message reactions (like 👍, ❤️, 😂)
- Real-time join/leave notifications
- User list sidebar

### 🔔 Notifications & UX

- Displays when users join or leave
- Live emoji reactions on messages

### 🧩 Technologies Used

- Frontend: React, Socket.io-client
- Backend: Node.js, Express, Socket.io
- Styling: Inline CSS (minimal)

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/PLP-MERN-Stack-Development/week-5-web-sockets-assignment-Sihlesnimba.git
cd week-5-web-sockets-assignment-Sihlesnimba
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Start the Development Servers

```bash
# In one terminal window:
cd server
npm run dev

# In another terminal window:
cd client
npm run dev
```

### 5. Open the App

Go to `http://localhost:3000` in your browser.

---

---

## 📁 Project Structure

```
socketio-chat/
├── client/                 # React front-end
│   ├── src/
│   │   ├── components/     # ChatRoom.jsx
│   │   ├── App.jsx         # Socket.io setup and layout
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js + Socket.io backend
│   ├── server.js           # Main server logic
│   └── package.json
└── README.md               # Project documentation
```

---

## 🧪 Assignment Requirements Met

- ✅ Real-time messaging using Socket.io
- ✅ User presence (online/offline)
- ✅ Private messaging
- ✅ Message reactions
- ✅ Notifications when users join/leave
- ✅ Typing indicators
- ✅ Responsive enough for desktop use

---

## 👤 Author

**Sihle Snimba** – [GitHub Repository](https://github.com/PLP-MERN-Stack-Development/week-5-web-sockets-assignment-Sihlesnimba)

---

## ✅ Submission Notes

- All code is committed and pushed to the GitHub Classroom repo.
- README includes overview, setup, features, and project structure.
- Deployment was skipped per instruction.

---

_This project is part of the PLP MERN Stack Week 5 Assignment._
