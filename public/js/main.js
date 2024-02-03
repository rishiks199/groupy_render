

const chatForm =  document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users');


//get UserName and room from URL to show which user joined and for which room
const {username,room} = Qs.parse(location.search,{
    //ignore ? $ and everything of this type this will
    //help to find only username and rooom from the URL
    ignoreQueryPrefix : true
});

console.log(username,room);


const socket = io();

// join chatRoom message in the screen
socket.emit('joinRoom',{username,room});


//get room and users on the left side using this call
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    
    outputUsers(users);
})
socket.on('message',message =>{


    outputMessagetoScreen(message);

        //focus on the lastest sent message
    chatMessages.scrollTop = chatMessages.scrollHeight;

    
}); 


chatForm.addEventListener('submit',e =>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    //console.log(mssg);

    //this will emit users message to the server 
    socket.emit('user-message',msg);

    //clear input
    e.target.elements.msg.value = '';
    //by adding focus the curson will stick to the input section
    //input type krne ke baad bhi cursor input section mein he rhe isliye focus use kiye
    e.target.elements.msg.focus();
}) 


function outputMessagetoScreen(message){
console.log(`Message - ${message}`);

const div = document.createElement('div');

div.classList.add('message');
const details = document.createElement('p');

details.classList.add('meta');
details.innerText =message.username ;
details.innerHTML += message.time;
div.appendChild(details);
const p = document.createElement('p');
p.classList.add('text');
p.innerHTML = message.text;
div.appendChild(p);

document.querySelector('.chat-messages').appendChild(div);

}

//Add room Name to DOM means to the left side
function outputRoomName(room){
    roomName.innerText = room;
}

function outputUsers(users){
    console.log(users);
userList.innerHTML = '';
users.forEach((user_name)=>{
    const li = document.createElement('li');
    li.innerText = user_name.username;
    userList.appendChild(li);
});



}

//working with leave Room Button 

document.getElementById('leave-btn').addEventListener('click',()=>{
    console.log('dad');
    const leaveRoom = confirm('Please Confirm to leave the Chat Group?');
    if(leaveRoom){
        window.location= 'index.html';
    }
})







