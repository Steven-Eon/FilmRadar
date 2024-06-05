const User = require('../models/user');

async function signUp (req, res){
    res.render('signup')
}

async function submit (req, res){
    try {
        const {username, password, firstName, lastName} = req.body;

        console.log(req.body);
        const user = await User.findOne({username});

        if(user){
            // res.sendStatus(500).json({error: 'Username already exists'});
            console.log('User already exists');
            return res.redirect('/signup')
        }
        else{
            const newUser = new User({
                username, password, firstName, lastName
            })
    
            await newUser.save();
            // res.sendStatus(200).json({message: 'User created successfully!'});
            console.log('User created Successfully')
            return res.redirect('/home');
        }

    } catch (error) {
        console.log("error making user", error)
        return res.status(500).json({error: 'Error making user'});
    }
}

module.exports = {
    signUp,
    submit
}