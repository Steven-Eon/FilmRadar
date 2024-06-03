async function getRoom(req, res) {
    const roomName = req.params.roomName;
    res.render('room', {roomName: roomName})
}

module.exports = {
    getRoom    
};