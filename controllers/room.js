const User = require("../models/user");


async function getRoom(req, res) {

  const email = req.cookies.email; // Assuming you store email in cookies
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const userName = user.username;

  const roomName = req.params.roomName;
  res.render("room", { userName: userName, roomName: roomName });
}

module.exports = {
  getRoom,
};
