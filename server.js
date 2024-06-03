// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const moment = require('moment');

const { MongoClient, ServerApiVersion } = require('mongodb');
let uri = "mongodb+srv://chatroomadmin:AJSodjlaj03hrtj20hnASOPdhj@cluster0.2bkhbpv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

// import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');
const newHandler = require('./controllers/new.js');
const { Server } = require('http');
const e = require('express');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/util', express.static('./util'));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set up stylesheets route




// TODO: Add server side code
app.get('/data/', async (req, res) => {
    const query = {roomId: {$exists: true}}
    try {
        await client.connect();
        const database = client.db('test');

        console.log("Connected to database");
        
        return database.collection('roomId').find(query, {"_id": 0,"roomId": 1})
            .sort({roomId: 1})
            .toArray()
            .then((result) => {
                client.close();
                res.status(200).send(JSON.stringify(result)).end();
            })
    }
    catch(e) {
        return res.status(500).send("Error connecting to database").end();
    }
})

app.post('/new', async (req, res) => {
    const params = req.body;
    try {
        await mongoose.connect(uri);
        const roomId = new mongoose.Schema({roomId: String}, {collection: 'roomId'});
        console.log("Connected to database");
        const roomIdModel = mongoose.model('roomId', roomId);
        const roomExists = await roomIdModel.exists({roomId: params.roomId});
        if (roomExists) {
            res.redirect('/room/' + params.roomId);
            return res.end();
        }
        else {
            const newRoom = new roomIdModel({roomId: params.roomId});
            await newRoom.save();
        }

        mongoose.connection.close();
        res.redirect("/room/" + params.roomId);
        return res.end();
    }
    catch (e) {
        return res.status(500).send("Error connecting to database").end();
    }
})

app.get('/room/:roomName/messages', async (req, res) => {
    const roomName = req.params.roomName;
    // console.log("Requested." + req.params.roomName)

    try {
        await mongoose.connect(uri);
        const collection = await mongoose.connection.db.collection(req.params.roomName)
        const results = await collection.find().toArray();
        mongoose.connection.close();
        res.json(results);
    }
    catch (e) {
        mongoose.connection.close();
        return res.status(500).send("Error connecting to database").end();
    }
})

app.post('/room/:roomName', async (req, res) => {
    let body = req.body;
    let Message;
    let time = moment().format('h:mm a');
    
    try{
        await mongoose.connect(uri);
        if (!mongoose.models[req.params.roomName]) 
        {
            const messageModel = new mongoose.Schema({userName: String, message: String, time: String}, {collection: req.params.roomName});
            Message = mongoose.model(req.params.roomName, messageModel);
        }
        else
        {
            Message = mongoose.model(req.params.roomName)
        }
    
        const sentMessage = new Message({userName: body.userName, message: body.message, time: time});
    
        console.log(body, time);
        await sentMessage.save();
        mongoose.connection.close();
        return res.status(200).end();;
    }
    catch(e) {
        return res.status(500).send("Error connecting to database").end();
    }

    
    


    
    
})

// Create controller handlers to handle requests at each endpoint
app.get('/', homeHandler.getHome);
app.get('/room/:roomName', roomHandler.getRoom);
app.get('/new', newHandler.getNew);

// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));