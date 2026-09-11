import { Server } from "socket.io"


export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });


    io.on("connection", (socket) => {

        console.log("SOMETHING CONNECTED")

        socket.on("join-call", (roomId) => {
            socket.join(roomId);
            socket.data.roomId = roomId;
            const clients = [...(io.sockets.adapter.rooms.get(roomId) || [])];
            io.to(roomId).emit("user-joined", socket.id, clients);
        })

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", (data, sender) => {

            const roomId = socket.data.roomId;
            if (roomId) io.to(roomId).emit("chat-message", data, sender, socket.id);

        })

        socket.on("disconnect", () => {

            const roomId = socket.data.roomId;
            if (roomId) socket.to(roomId).emit("user-left", socket.id);
            socket.leave(roomId);

        })

    })


    return io;
}
