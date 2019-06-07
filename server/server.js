const express = require('express')
const http = require('http')
const socketIO = require('socket.io')


const app = express()
const server = http.createServer(app)
const io = socketIO(server)

let users = {};
let rooms = {};

io.on('connection', socket => {
    console.log("ID: ", socket.id);

    console.log('New client connected');
    socket.on('creategame', (data) => {
        socket.join(data.room_name);

        rooms[data.room_name] = {}
        rooms[data.room_name] = {
            player1: socket.id
        }
        console.log("room created with id", data);
    })
    socket.on('joingame', (data)=>{
        console.log("join games room ", rooms);
        console.log("join games data ", data);
        rooms[data.room_name]["player2"] = socket.id;
        socket.join(data.room_name)
        rooms[data.room_name][data.gamer_id] = rooms[data.room_name].player1;
        rooms[data.room_name][rooms[data.room_name].player1] = data.gamer_id;
        console.log("Joined room with id", rooms);
    })
    socket.on("my_move", (move)=>{
        // console.log(rooms);
        console.log("catching my move ", move);
        io.to(rooms[move.room_name][move.to]).emit('message', move);
        console.log("message emmitted: ", rooms[move.room_name][move.to]);

    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

server.listen(4001, () => console.log("Listening on port 4001"))