const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors())

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})

io.on("connection", socket => {
    console.log(`user connected ${socket.id}`)
    socket.on('join_room', data => {
        socket.join(data)
        let total = io.sockets.adapter.rooms.get(data).size
        console.log("room", data)
        socket.to(data).emit("is_second_user", total === 2);
    })
    socket.on('send_message', data => {
        console.log(data)
        socket.to(data.room).emit('receive_message', data)
    })
})

server.listen(3001, () => console.log("run"))