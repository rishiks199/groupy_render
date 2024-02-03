const users = []


//join user to chat 

function userJoin(id,username,room){

   const user  = {id,username,room};
   
   users.push(user);
   return users;

}

//Get current user

function getCurrentUser(id){
    return users.find(user=> user.id ===id)
}


//user details if user leaves the chat 

function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    //findIndex returns -1 if user not found
    if(index!==-1){
        return users.splice(index,1)[0];
    }
}

//Get Room Users
function getRoomUsers(room){
    //console.log(room);
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave
};