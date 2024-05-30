// home.js
const db = require('../path/to/db'); // Assuming you have some database module

function getHome(request, response){
    db.getChatrooms().then(chatrooms => {
        response.render('home', {title: 'Home', chatrooms: chatrooms});
    });
}

module.exports = {
    getHome
};
