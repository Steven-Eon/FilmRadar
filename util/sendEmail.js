// const nodemailer = require('nodemailer');
// const { google } = require('googleapis');
// const crypto = require('crypto');

// const CLIENT_ID = '';
// const CLIENT_SECRET = '';
// const REDIRECT_URI = '';
// const REFRESH_TOKEN = '';

// const oAuth2Client = new google.auth.OAuth2(
//     CLIENT_ID,
//     CLIENT_SECRET,
//     REDIRECT_URI
// );

// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// async function sendVerificationEmail(email) {
//     try {
//         const accessTokenResponse = await oAuth2Client.getAccessToken();
//         const accessToken = accessTokenResponse.token;

//         console.log('Access Token:', accessToken);

//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 type: 'OAuth2',
//                 user: 'chatroomtesting1@gmail.com', // Your Gmail address
//                 clientId: CLIENT_ID,
//                 clientSecret: CLIENT_SECRET,
//                 refreshToken: REFRESH_TOKEN,
//                 accessToken: accessToken,
//             },
//         });

//         const code = crypto.randomBytes(3).toString('hex').toUpperCase(); // Generate a 6-character hex code
//         const mailOptions = {
//             from: 'chatroomtesting1@gmail.com', // Your Gmail address
//             to: email,
//             subject: 'Your Verification Code',
//             text: `Your verification code is ${code}. Please enter this code to verify your email address.`,
//         };

//         await transporter.sendMail(mailOptions);
//         console.log(`Verification email sent to ${email} with code: ${code}`);
//         return code; // Return the code after sending the email
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw new Error('Error sending email');
//     }
// }

// module.exports = sendVerificationEmail;
