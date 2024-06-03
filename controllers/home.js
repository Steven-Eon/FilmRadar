const fetch = require('node-fetch');

async function getHome(req, res) {
    let response = await fetch('http://localhost:8080/data/');
    if (response.status === 200) {
        const data = await response.text();
        const parsedData = JSON.parse(data);
        let finalData = [];
        for (let i of parsedData) {
            finalData.push(i);
        }
        // console.log(finalData[0]);
        res.render('home', {roomId: finalData});
    }
    
}

module.exports = {
    getHome
};