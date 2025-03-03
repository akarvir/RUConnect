const express = require('express');
const http = require('http'); 
const socketio = require('socket.io');
const redis = require('redis'); 

const app = express(); 
const server = http.createServer(app); 
const io = socketio(server); 

require('dotenv').config(); 

const port = process.env.PORT; 


const redisclient = redis.createClient(); 

redisclient.on('error',(err)=>console.log(`Reddis error: ${err}`)); 

redisclient.subscribe('chatmessages'); 

let users = {}; 


// when redis receives a published message.
redisclient.on('message',(channel, message)=>{

    if(channel=== 'chatmessages') {

        const parsed = JSON.parse(message) // converted to string before being published to the 'chatmessages' channel. 

        if(parsed.type === 'private') {

            const targetsocketid = users[parsed.target]; 
            if(targetsocketid) {
                io.to(targetsocketid).emit('privatemessage',parsed); 
            }
        else if(parsed.type=='group') {
            io.to(parsed.room).emit('groupmessage',parsed); 
        }



        }
    }

})

io.on('connection',(socket)=>{
    console.log(`User connected with id ${socket.id}`); 

    socket.on('register',(username)=>{
        users[username] = socket.id; 
        console.log(`User registered: ${username} ${socket.id}`); 
    })

    socket.on('joinroom',(room)=>{
        socket.join(room); 
        console.log(`Socket ${socket.id} has joined room ${room}`); 
    })

    socket.on('message',(data)=>{
        redisclient.publish('chatmessages',JSON.stringify(data)); 
    })

    socket.on('disconnect',()=>{
        for(const username in users) {
            if(users[username]=== socket.id) {
                delete users[username];
                break;
            }
        }
        console.log(`User ${socket.id} disconnected`); 
    })


})

app.listen(port,()=>{
    console.log(`Server running on port ${port}`); 
})


