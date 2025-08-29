import express from "express";
import {createServer} from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
// import newUserRoutes from "./routes/newUser.routes.js";


const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000))
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);
// app.use("/api/v2/users",newUserRoutes);

// app.get("/home", (req, res) => {
//     return res.json({"hello":"world"})
// }); 

const start = async()=>{
    app.set("mongo_user");
    const connectionDb = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MONGO Connected to DB HOST: ${connectionDb.connection.host}`);
    
    server.listen(app.get("port"), () => {
        console.log("Listening on port 8000");
    });
} 

start();