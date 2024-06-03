async function getRoom(req, res) {
    const roomName = "TEST"
    res.render('room', {roomName: 'roomName', newRoomId: 'newRoomId'})
}

module.exports = {
    getRoom    
};