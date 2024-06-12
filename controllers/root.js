const User = require("../models/user");
const bcrypt = require("bcrypt");

async function getRoot(req, res) {
  res.render("root");
}

async function signIn(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isCorrect = await bcrypt.compare(password, user?.password || "");

    if (!isCorrect || !user) {
      console.log("Wrong username or password");
      res.redirect("/");
    } else {
      console.log("Login successful");
      res.cookie("email", user.email, { httpOnly: true });
      res.redirect("/home");
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Server Error" });
  }
}

module.exports = {
  getRoot,
  signIn,
};
