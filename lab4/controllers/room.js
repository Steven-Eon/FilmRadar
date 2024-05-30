// room.js
const roomGenerator = require('../util/roomIdGenerator.js');
const db = require('../path/to/db'); // Assuming you have some database module

function getRoom(request, response){
    let roomName = request.params.roomName;
    db.getMessages(roomName).then(messages => {
        response.render('room', {title: 'Chatroom', roomName: roomName, messages: messages});
    });
}

function fetchMessages(request, response){
    const roomName = request.params.roomName;
    Message.find({ roomName: roomName })
        .then(messages => response.json(messages))
        .catch(err => response.status(500).json(err));
}

// Update existing createRoom function with the possibility of accepting a roomName
function createRoom(request, response){
    const roomName = request.body.roomName || roomGenerator.roomIdGenerator();
    const newRoom = new Chatroom({ name: roomName });
    newRoom.save()
        .then(() => response.redirect('/' + roomName))
        .catch(err => response.status(500).send(err));
}

module.exports = {
    getRoom,
    createRoom,
    fetchMessages
};
