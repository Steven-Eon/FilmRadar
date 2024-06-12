const User = require("../models/user");


async function getSearch(req, res) {
    const roomID = req.params.roomName
    const redirectURL = `http://localhost:8080/room/${req.params.roomName}/`;
    res.render("search", {redirectURL: redirectURL, roomName: roomID })
}

module.exports = {
    getSearch,
};
