# NexoMeet

NexoMeet is a full-stack video meeting application built with React (frontend) and Node.js/Express (backend), featuring real-time video calls, chat, and user authentication.

## Features

- **Video Meetings:** Peer-to-peer video calls using WebRTC and Socket.IO.
- **Chat:** Real-time messaging during meetings.
- **User Authentication:** Register and login with username and password.
- **Meeting History:** View your past meeting codes and dates.
- **Responsive UI:** Built with Material UI and custom CSS.

## Project Structure

```
Frontend/
  ├── public/           # Static assets (images, icons)
  ├── src/
  │   ├── pages/        # React pages (Landing, Auth, Home, VideoMeet, History)
  │   ├── contexts/     # AuthContext for user state and API calls
  │   ├── utils/        # Utility functions (withAuth HOC)
  │   ├── styles/       # CSS modules
  │   └── App.jsx       # Main app component
  ├── index.html        # Entry point
  ├── vite.config.js    # Vite configuration
  └── package.json      # Frontend dependencies and scripts

Backend/
  ├── src/
  │   ├── controllers/  # Express controllers (user, socketManager)
  │   ├── models/       # Mongoose models (User, Meeting)
  │   ├── routes/       # Express routes (user.routes.js)
  │   └── app.js        # Backend entry point
  └── package.json      # Backend dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Backend Setup

1. Install dependencies:
   ```sh
   cd Backend
   npm install
   ```
2. Configure MongoDB connection in `src/app.js` (uses MongoDB Atlas by default).
3. Start the backend server:
   ```sh
   npm run dev
   ```
   The backend runs on port `8000` by default.

### Frontend Setup

1. Install dependencies:
   ```sh
   cd Frontend
   npm install
   ```
2. Start the frontend development server:
   ```sh
   npm run dev
   ```
   The frontend runs on port `5173` by default (Vite).

### Build for Production

```sh
cd Frontend
npm run build
```
Output is in the `Frontend/build` directory.

## Environment Configuration

- The frontend uses [`src/environment.js`](src/environment.js) to switch between production and local backend URLs.
- Update the MongoDB connection string in [`Backend/src/app.js`](Backend/src/app.js) as needed.

## Usage

- Visit the landing page to register or login.
- Join meetings by entering a meeting code.
- View meeting history from the home page.
- Use chat during video calls.

---

**Author:** Shubham Singh
