const User = require("../models/user");
const bcrypt = require("bcrypt");

async function signUp(req, res) {
  res.render("signup");
}

async function submit(req, res) {
  try {
    const { username, password, firstName, lastName, email } = req.body;

    console.log(req.body);
    const userByUsername = await User.findOne({ username });
    const userByEmail = await User.findOne({ email });

    if (userByUsername) {
      console.log("Username already exists");
      return res.render("signup", { message: "Username already exists" });
    }

    if (userByEmail) {
      console.log("Email already exists");
      return res.render("signup", { message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
    });

    await newUser.save();
    console.log("User created Successfully");

    res.cookie("email", newUser.email, { httpOnly: true });
    return res.redirect("/home");
  } catch (error) {
    console.log("error making user", error);
    return res.status(500).json({ error: "Error making user" });
  }
}

module.exports = {
  signUp,
  submit,
};
