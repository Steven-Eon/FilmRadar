const User = require('../models/user');

async function getRoot(req, res){
    res.render('root');
}

async function signIn(req, res){
   try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if(!user){
            // res.status(200).json({message: "User not found!"})
            res.redirect('/');
        }
        else if(user.password !== password){
            res.status(401).json({error: "Invalid password!"});
        }
        else{
            res.redirect('/home');
        }
        
        
   }catch (error) {
        console.log("Error: ", error)
        res.status(500).json({error: "Server Error"});
   }
}

module.exports = {
    getRoot,
    signIn
}