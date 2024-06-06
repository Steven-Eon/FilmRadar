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
const rootHandler = require('./controllers/root.js');
const signupHandler = require('./controllers/signup.js');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/util', express.static('./util'));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Create controller handlers to handle requests at each endpoint
app.get('/', rootHandler.getRoot);
app.post('/', rootHandler.signIn);

app.post('/verify', rootHandler.verify);

app.get('/signup', signupHandler.signUp);
app.post('/signup', signupHandler.submit);

app.get('/home', homeHandler.getHome);
app.get('/new', newHandler.getNew);
app.post('/new', async (req, res) => {
    const params = req.body;
    try {
        const roomIdSchema = new mongoose.Schema({ roomId: String }, { collection: 'roomId' });
        const roomIdModel = mongoose.model('roomId', roomIdSchema);
        const roomExists = await roomIdModel.exists({ roomId: params.roomId });
        if (roomExists) {
            return res.redirect('/room/' + params.roomId);
        } else {
            const newRoom = new roomIdModel({ roomId: params.roomId });
            await newRoom.save();
            return res.redirect('/room/' + params.roomId);
        }
    } catch (e) {
        console.error("Error connecting to database", e);
        return res.status(500).send("Error connecting to database").end();
    }
});

app.get('/data/', async (req, res) => {
    const query = { roomId: { $exists: true } };
    try {
        await client.connect();
        const database = client.db('test');
        const results = await database.collection('roomId').find(query, { "_id": 0, "roomId": 1 }).sort({ roomId: 1 }).toArray();
        await client.close();
        res.status(200).json(results).end();
    } catch (e) {
        console.error("Error connecting to database", e);
        return res.status(500).send("Error connecting to database").end();
    }
});

app.get('/room/:roomName', roomHandler.getRoom);
app.post('/room/:roomName', async (req, res) => {
    let body = req.body;
    let time = moment().format('h:mm a');

    try {
        let Message;
        if (!mongoose.models[req.params.roomName]) {
            const messageSchema = new mongoose.Schema({ userName: String, message: String, time: String }, { collection: req.params.roomName });
            Message = mongoose.model(req.params.roomName, messageSchema);
        } else {
            Message = mongoose.model(req.params.roomName);
        }

        const sentMessage = new Message({ userName: body.userName, message: body.message, time: time });
        await sentMessage.save();
        return res.status(200).end();
    } catch (e) {
        console.error("Error connecting to database", e);
        return res.status(500).send("Error connecting to database").end();
    }
});

app.get('/room/:roomName/messages', async (req, res) => {
    const roomName = req.params.roomName;
    try {
        const collection = mongoose.connection.db.collection(roomName);
        const results = await collection.find().toArray();
        res.json(results);
    } catch (e) {
        console.error("Error connecting to database", e);
        return res.status(500).send("Error connecting to database").end();
    }
});

app.listen(port, async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`Server listening on http://localhost:${port}`);
    } catch (e) {
        console.error("Error connecting to MongoDB", e);
    }
});
