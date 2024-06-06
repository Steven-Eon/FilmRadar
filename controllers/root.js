const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const sendVerificationEmail = require('../util/sendEmail');
const crypto = require('crypto');

const verificationCodes = new Map(); // Store verification codes temporarily

async function getRoot(req, res){
    res.render('root');
}

async function signIn(req, res){
   try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if(!user){
            // res.status(200).json({message: "User not found!"})
            return res.status(400).render('root', { error: 'User not found!' });
        }
        else if(user.password !== password){
            return res.status(401).render('root', { error: 'Invalid password!' });
        }
        else{
            // User found and password is correct, send verification code
            const verificationCode = await sendVerificationEmail(username);
            verificationCodes.set(username, verificationCode);

            console.log(`Verification code sent to ${username}: ${verificationCode}`);

            return res.render('verify', { username });
        }
        
        
   }catch (error) {
        console.log("Error during signing process: ", error)
        res.status(500).render('root',{error: "Server Error"});
   }
}

async function verify(req, res) {
    const { username, code } = req.body;

    const storedCode = verificationCodes.get(username);

    if (storedCode && storedCode === code) {
        verificationCodes.delete(username);
        // Log the user in (e.g., set a session or token)
        return res.redirect('/home');
    } else {
        return res.status(400).render('verify', { username, error: 'Invalid verification code' });
    }
}


module.exports = {
    getRoot,
    signIn,
    verify
}