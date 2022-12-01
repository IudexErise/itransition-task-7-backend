const express = require('express')
const app = express()

const PORT = process.env.PORT || 4000;

const path = require('path');
app.use(express.static(path.join(__dirname, '/build/')));

app.use(express.json());

const server = app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}...`));

const socket = require('socket.io');
const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on('connection', (socket) => {
    socket.on('reqTurn', (data) => {
        const room = JSON.parse(data).room
        io.to(room).emit('playerTurn', data)
    })

    socket.on('create', room => {
        socket.join(room)
    })

    socket.on('join', room => {
        socket.join(room)
        io.to(room).emit('opponent_joined')
    })

    socket.on('reqRestart', (data) => {
        const room = JSON.parse(data).room
        io.to(room).emit('restart')
    })
});