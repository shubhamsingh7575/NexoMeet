# NexoMeet

NexoMeet is a full-stack video meeting application for creating and joining meetings with a meeting code. It includes real-time video/audio communication, screen sharing, in-meeting chat, authentication, meeting history, and email invitations through SendGrid.

## Live demo

[Open NexoMeet](https://nexomeet-f.onrender.com/)

## Features

- User registration, login, current-user session check, and logout
- JWT-based bearer-token authentication
- Create or join meetings with a meeting code
- WebRTC video and audio calls
- Camera, microphone, and screen-share controls
- Real-time signaling and chat with Socket.IO
- Meeting history with pagination
- Delete one meeting or clear the complete meeting history
- Send meeting invitations by email through SendGrid
- Responsive React and Material UI interface

## Tech stack

### Frontend

- React 19, Vite, React Router
- Material UI and Axios
- Socket.IO Client
- Browser WebRTC APIs

### Backend

- Node.js and Express 5
- MongoDB with Mongoose
- Socket.IO
- JWT and bcrypt authentication
- SendGrid Web API for email invitations

## Project structure

```text
NexoMeet_project/
├── Backend/
│   ├── src/
│   │   ├── app.js                         # Express and Socket.IO entry point
│   │   ├── controllers/
│   │   │   ├── auth.controller.js         # Register, login, current user, logout
│   │   │   ├── meeting.controller.js      # Meeting CRUD and history
│   │   │   ├── notification.controller.js # Email invitation requests
│   │   │   └── socketManager.js            # WebRTC signaling and chat events
│   │   ├── middleware/
│   │   │   ├── auth.js                     # Bearer-token authentication
│   │   │   └── errorHandler.js             # Centralized API errors
│   │   ├── models/                         # User and Meeting schemas
│   │   ├── routes/                         # Auth, meeting, notification routes
│   │   ├── services/email.service.js       # SendGrid delivery
│   │   └── utils/AppError.js
│   ├── .env.example
│   └── package.json
│
├── Frontend/
│   ├── public/                             # Static assets
│   ├── src/
│   │   ├── App.jsx                         # Routes and application shell
│   │   ├── environment.js                 # Reads VITE_API_URL
│   │   ├── contexts/                       # Authentication state
│   │   ├── pages/                          # Landing, auth, home, meeting, history
│   │   ├── utils/withAuth.jsx              # Protected-page wrapper
│   │   ├── styles/                         # Meeting component styles
│   │   └── App.css, index.css
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB Atlas or a local MongoDB server
- SendGrid account with a verified sender email

## Environment variables

### Backend

Create `Backend/.env` using `Backend/.env.example`:

```env
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexomeet
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=verified-sender@example.com
```

`SENDGRID_FROM_EMAIL` must be verified in SendGrid. Never expose `SENDGRID_API_KEY` in the frontend or commit it to Git.

### Frontend

Create `Frontend/.env` using `Frontend/.env.example`:

```env
VITE_API_URL=http://localhost:8000
```

The frontend reads this value from `Frontend/src/environment.js`. If it is missing, the app falls back to `http://localhost:8000`.

## Run locally

Use two terminals:

```bash
# Terminal 1
cd Backend
npm install
npm run dev
```

Backend: `http://localhost:8000`

```bash
# Terminal 2
cd Frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Useful commands

```bash
cd Frontend && npm run lint
cd Frontend && npm run build
cd Backend && npm start
```

## API overview

All API routes use the `/api/v1` prefix. Authenticated routes require a bearer token.

### Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Login and receive a token |
| GET | `/auth/me` | Get the logged-in user |
| POST | `/auth/logout` | Logout the current session |

### Meetings

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/meetings` | Get paginated meeting history |
| POST | `/meetings` | Save a meeting in history |
| GET | `/meetings/:id` | Get one meeting |
| DELETE | `/meetings/:id` | Delete one meeting |
| DELETE | `/meetings` | Clear complete history |

### Notifications

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/notifications/email` | Send a meeting invitation through SendGrid |

## How meetings work

1. The user logs in or registers.
2. The user creates or enters a meeting code.
3. Socket.IO exchanges WebRTC offers, answers, and ICE candidates.
4. WebRTC carries audio/video between participants when possible.
5. Socket.IO carries meeting events and chat messages.
6. Ending a meeting closes peer connections, stops local media tracks, clears meeting state, and returns the user to the correct page.

The app uses a public STUN server for peer discovery. A TURN server may be needed for reliable connections on restrictive networks.

## Deploying on Render

### Backend web service

- Root directory: `Backend`
- Build command: `npm install`
- Start command: `npm start`
- Add all backend variables from the Backend section.
- Set `FRONTEND_URL` to the deployed frontend URL.

### Frontend static site

- Root directory: `Frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Add this Render environment variable:

```env
VITE_API_URL=https://your-backend-service.onrender.com
```

After changing `VITE_API_URL`, trigger a new frontend deploy because Vite injects frontend variables during the build.

## Security and scaling notes

- Keep `.env` files out of Git.
- Use a strong, unique `JWT_SECRET` in production.
- Restrict `FRONTEND_URL` to the actual frontend origin.
- Keep SendGrid credentials only on the backend.
- Use HTTPS in production for camera, microphone, and screen sharing.
- Current WebRTC signaling and chat state is held in server memory. Multiple backend instances will eventually need a shared Socket.IO adapter or another shared coordination layer.

## Author

Shubham Singh
