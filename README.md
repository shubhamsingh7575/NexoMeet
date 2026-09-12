# 🚀 NexoMeet  

A scalable full-stack video conferencing platform featuring WebRTC-powered video/audio calls, screen sharing, live chat, and meeting management. Secure authentication and a robust backend ensure smooth collaboration.

🌐 **Live Demo**: [NexoMeet Deployment](https://nexomeet-f.onrender.com)  

---

## ✨ Features  

- 🎥 **Video Meetings** – Peer-to-peer video calls powered by **WebRTC** and **Socket.IO**.  
- 💬 **Real-time Chat** – In-meeting chat with message notifications.  
- 🔐 **Authentication** – Secure login & registration using signed, expiring bearer tokens.
- 🕑 **Meeting History** – Track past meetings with codes and timestamps.  
- 🖥️ **Screen Sharing** – Share your screen using the **Navigator API (getDisplayMedia)**.  
- 📡 **STUN Server Integration** – Uses Google’s public STUN server for peer discovery.  
- 📱 **Responsive UI** – Built with **Material UI** and custom CSS for desktop & mobile.  

---

## 🏗️ Tech Stack  

### **Frontend**  
- React (Vite)  
- Material UI  
- WebRTC APIs  
- Socket.IO Client  

### **Backend**  
- Node.js + Express  
- MongoDB (Mongoose)  
- Socket.IO  
- JWT Authentication  

---

## 📂 Project Structure  

```
Frontend/
  ├── public/           # Static assets (icons, logos)
  ├── src/
  │   ├── pages/        # React pages (Landing, Auth, Home, VideoMeet, History)
  │   ├── contexts/     # AuthContext for JWT-based authentication
  │   ├── utils/        # Utility functions (withAuth HOC, API helpers)
  │   ├── styles/       # CSS modules
  │   └── App.jsx       # Main React entry
  ├── index.html        # Entry point
  ├── vite.config.js    # Vite config
  └── package.json      # Frontend dependencies

Backend/
  ├── src/
  │   ├── controllers/  # Express controllers (auth, socket manager)
  │   ├── models/       # MongoDB models (User, Meeting)
  │   ├── routes/       # REST API routes
  │   └── app.js        # Server entry point
  └── package.json      # Backend dependencies
```

---

## ⚡ Getting Started  

### 🔹 Prerequisites  
- Node.js **v18+**  
- npm  
- MongoDB (Atlas or local instance)  

---

### 🔹 Backend Setup  

```sh
cd Backend
npm install
npm run dev
```
👉 Runs at **http://localhost:8000** by default.  

---

### 🔹 Frontend Setup  

```sh
cd Frontend
npm install
npm run dev
```
👉 Runs at **http://localhost:5173** (Vite).  

---

### 🔹 Build for Production  

```sh
cd Frontend
npm run build
```
Build output will be in `Frontend/dist/`.  

---

## ⚙️ Environment Configuration  

- **Frontend** – API base URL is managed by `VITE_API_URL` and read in `src/environment.js`.  
- **Backend** – Update MongoDB connection in `Backend/src/app.js`.  
- **Auth** – Signed, expiring bearer tokens are used for authentication & session management.

---

## 📌 Usage  

1. Register or Login to your account.  
2. Create or Join a meeting with a unique code.  
3. Use video + audio calls with WebRTC.  
4. Share your screen with the **Screen Share** button.  
5. Chat with participants in real-time.  
6. End the meeting – details get saved in **Meeting History**.  

---

## 🔍 How It Works  

### **WebRTC (Web Real-Time Communication)**  
WebRTC enables **peer-to-peer video and audio streaming** directly between users’ browsers.  
- Handles **camera/microphone access**  
- Supports **screen sharing**  
- Provides **low-latency communication** without external plugins  

### **Socket.IO**  
Socket.IO is used for **real-time signaling** between peers:  
- Establishes a connection channel between users and the server  
- Shares **session descriptions (SDP)** and **ICE candidates**  
- Keeps track of **user joins, leaves, and chat messages**  

Together, **WebRTC** handles the actual media streaming, while **Socket.IO** manages the signaling and messaging.  

---

## 🛠️ Future Enhancements  

- 📱 Mobile app version (React Native).  
- 📊 Analytics dashboard for meetings.  
- 🎙️ Background noise suppression.  
- 📡 Custom TURN server for better connectivity.  

---

## 👨‍💻 Author  

**Shubham Singh**  

🌐 [Live Demo](https://nexomeet-f.onrender.com)  
