const User = require("../models/user");
const bcrypt = require("bcrypt");

async function signUp(req, res) {
  res.render("signup");
}

async function submit(req, res) {
  try {
    const { username, password, firstName, lastName, email } = req.body;

    console.log(req.body);
    const user = await User.findOne({ username });

    if (user) {
      // res.sendStatus(500).json({error: 'Username already exists'});
      console.log("User already exists");
      return res.redirect("/signup");
    } else {
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
      // res.sendStatus(200).json({message: 'User created successfully!'});
      console.log("User created Successfully");
      return res.redirect("/home");
    }
  } catch (error) {
    console.log("error making user", error);
    return res.status(500).json({ error: "Error making user" });
  }
}

module.exports = {
  signUp,
  submit,
};
