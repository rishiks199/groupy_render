const express = require('express')
const path = require('path')
const socketio= require('socket.io');
const http = require('http');
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');


const app = express();

const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: "groupy-chatapp-for-random-groups-3c2ktyu62-rishiks199s-projects.vercel.app",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});


app.use(express.static(path.join(__dirname,'public')));

const botName  = 'Bot is here ';

//Run when Client connects
io.on('connection',socket =>{
    socket.on('joinRoom',({username,room})=>{
       
        const user = userJoin(socket.id,username,room);
       // console.log(user);
        socket.join(user[user.length-1].room);
        //welcomes the new user
        socket.emit('message',formatMessage(botName,'Welcome to the Chat'));

      //  console.log('New WebSocket Js');
        //socket.emit -> sends or emits message to a single user
        //socket.broadcast.emit ->sends a message to every one but not you
        //io.emit -> sends the message to every one including you in general
        //console.log(user[0].username);
        socket.broadcast
        .to(user[user.length-1].room)
        .emit('message',formatMessage(botName,`${user[user.length-1].username} has Joined the Chat`));
        

        //sends users and room info so that DOM can use and place the names and rooms in left side 

io.to(user[user.length-1].room).emit('roomUsers',{
    room:user[user.length-1].room,
    users:getRoomUsers(user[user.length-1].room)  
     
    });
 });
 
       
//listen to chat Message
socket.on('user-message',msg=>{

    const user = getCurrentUser(socket.id);
  //  console.log(user);

    io.to(user.room)
    .emit('message',formatMessage(user.username,msg));
})

//Runs when client Disconnects

socket.on('disconnect',()=>{
    const user = userLeave(socket.id);

    if(user){
        io.to(user.room)
        .emit('message',
        formatMessage(botName,`${user.username} has left the Chat`)
        );

        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)  
             
            });
    }

    
})

});

const PORT = 300 || process.env.PORT;
//server
server.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
});

