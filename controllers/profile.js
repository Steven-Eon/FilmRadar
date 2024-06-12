const User = require("../models/user");
const bcrypt = require("bcrypt");

async function getProfile(req, res) {
  const email = req.cookies.email; // Assuming you store email in cookies
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send("User not found");
  }

  res.render("profile", {
    username: user.username,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
}

async function updateProfile(req, res) {
  const email = req.cookies.email; // Assuming you store email in cookies
  const { username, password, firstName, lastName } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }
    
    user.username = username;
    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));;
    user.firstName = firstName;
    user.lastName = lastName;

    await user.save();
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating profile");
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
