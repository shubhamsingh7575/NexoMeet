import express from "express";
import {createServer} from "node:http";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";


const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000))
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/meetings", meetingRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.use(errorHandler);

const start = async()=>{
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not configured");
    }
    const connectionDb = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MONGO Connected to DB HOST: ${connectionDb.connection.host}`);
    
    server.listen(app.get("port"), () => {
        console.log(`Listening on port ${app.get("port")}`);
    });
} 

start();
