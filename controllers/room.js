const User = require("../models/user");


async function getRoom(req, res) {
  const redirectURL = `http://localhost:8080/room/${req.params.roomName}/search`;
  const email = req.cookies.email; // Assuming you store email in cookies
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const userName = user.username;

  const roomName = req.params.roomName;
  res.render("room", { userName: userName, roomName: roomName, redirectAddress: redirectURL });
}

module.exports = {
  getRoom,
};
