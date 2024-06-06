const User = require('../models/user');
const { check, validationResult } = require('express-validator');

async function signUp (req, res) {
    res.render('signup');
}

async function submit (req, res) {
    // Run validation
    await check('username', 'Username must be a valid email').isEmail().run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('signup', { errors: errors.array() });
    }

    try {
        const { username, password, firstName, lastName } = req.body;

        console.log(req.body);
        const user = await User.findOne({ username });

        if (user) {
            console.log('User already exists');
            return res.status(400).render('signup', { errors: [{ msg: 'Email already exists' }] });
        } else {
            const newUser = new User({
                username, password, firstName, lastName
            });
            console.log('Saving new user:', newUser);
            await newUser.save();
            console.log('User created Successfully');
            return res.redirect('/');
        }
    } catch (error) {
        console.error("Error making user:", error.message);
        console.error("Stack trace:", error.stack);
        return res.status(500).json({ error: 'Error making user' });
    }
}

module.exports = {
    signUp,
    submit
};
