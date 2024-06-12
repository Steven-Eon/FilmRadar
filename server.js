// import dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const hbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const moment = require("moment");

const { MongoClient, ServerApiVersion } = require("mongodb");
let uri =
  "mongodb+srv://chatroomadmin:AJSodjlaj03hrtj20hnASOPdhj@cluster0.2bkhbpv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// import handlers
const homeHandler = require("./controllers/home.js");
const roomHandler = require("./controllers/room.js");
const newHandler = require("./controllers/new.js");
const rootHandler = require("./controllers/root.js");
const signupHandler = require("./controllers/signup.js");
const profileHandler = require("./controllers/profile.js");
const searchHandler = require("./controllers/search.js")
const authMiddleware = require("./util/authMiddleware");
const { Server } = require("http");
const e = require("express");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/util", express.static("./util"));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Create controller handlers to handle requests at each endpoint
app.get("/", rootHandler.getRoot);
app.post("/", rootHandler.signIn);

app.get("/profile", authMiddleware, profileHandler.getProfile);
app.post("/profile", authMiddleware, profileHandler.updateProfile);

app.get("/signup", signupHandler.signUp);
app.post("/signup", signupHandler.submit);

app.get("/home", homeHandler.getHome);
app.get("/new", newHandler.getNew);

app.post("/new", async (req, res) => {
  const params = req.body;
  try {
    const roomId = new mongoose.Schema(
      { roomId: String },
      { collection: "roomId" }
    );
    console.log("Connected to database");
    const roomIdModel = mongoose.model("roomId", roomId);
    const roomExists = await roomIdModel.exists({ roomId: params.roomId });
    if (roomExists) {
      res.redirect("/room/" + params.roomId);
      return res.end();
    } else {
      const newRoom = new roomIdModel({ roomId: params.roomId });
      await newRoom.save();
    }
    res.redirect("/room/" + params.roomId);
    return res.end();
  } catch (e) {
    return res.status(500).send("Error connecting to database").end();
  }
});

app.get("/data/", async (req, res) => {
  const query = { roomId: { $exists: true } };
  try {
    await client.connect();
    const database = client.db("test");

    console.log("Connected to database");

    return database
      .collection("roomId")
      .find(query, { _id: 0, roomId: 1 })
      .sort({ roomId: 1 })
      .toArray()
      .then((result) => {
        client.close();
        res.status(200).send(JSON.stringify(result)).end();
      });
  } catch (e) {
    return res.status(500).send("Error connecting to database").end();
  }
});

app.get("/room/:roomName", roomHandler.getRoom);
app.post("/room/:roomName", async (req, res) => {
  
  let body = req.body;
  let Message;
  let time = moment().format("h:mm a");

  try {
    if (!mongoose.models[req.params.roomName]) {
      const messageModel = new mongoose.Schema(
        { messageId: String, userName: String, message: String, time: String },
        { collection: req.params.roomName }
      );
      Message = mongoose.model(req.params.roomName, messageModel);
    } else {
      Message = mongoose.model(req.params.roomName);
    }

    // console.log("Test" + Message.countDocuments());
    
    const id = await Message.countDocuments();
    
    console.log(id);
    

  
    const sentMessage = new Message({
      messageId: id,
      userName: body.userName,
      message: body.message,
      time: time,
    });

    console.log(sentMessage, time);
    try {
      await sentMessage.save();
    } catch (error) {
      console.log(error);
    }

    return res.status(200).end();
  } catch (e) {
    return res.status(500).send("Error connecting to database").end();
  }
});
app.get("/room/:roomName/messages", async (req, res) => {
  const roomName = req.params.roomName;
  // console.log("Requested." + req.params.roomName)

  try {
    const collection = await mongoose.connection.db.collection(
      req.params.roomName
    );
    const results = await collection.find().toArray();
    res.json(results);
  } catch (e) {
    return res.status(500).send("Error connecting to database").end();
  }
});

app.put("/room/:roomName/", async (req, res) => {
  console.log("Request received.")
  if (!mongoose.models[req.params.roomName]) {
    const messageModel = new mongoose.Schema(
      { messageId: String, userName: String, message: String, time: String },
      { collection: req.params.roomName }
    );
    Message = mongoose.model(req.params.roomName, messageModel);
  } 
  else {
    Message = mongoose.model(req.params.roomName);
  }

  try {
    console.log(req.body)
    await Message.findOneAndUpdate({ 'messageId': req.body.messageId }, { 'message' : req.body.message }, { new: true })
      .then(e => console.log(e))
      .catch(e => console.log(e));
    return res.status(200).send("Successfully updated.")
  }
  catch(e)
  {
    return res.status(500).send("Error connecting to database.")
  }

});

app.get("/room/:roomName/search", searchHandler.getSearch)
app.put("/room/:roomName/search", async (req, res) => {
  console.log("Request received!")
  try {
    if (!mongoose.models[req.params.roomName]) {
      const messageModel = new mongoose.Schema(
        { messageId: String, userName: String, message: String, time: String },
        { collection: req.params.roomName }
      );
      Message = mongoose.model(req.params.roomName, messageModel);
    } 
    else {
      Message = mongoose.model(req.params.roomName);
    }
  
    const results = await Message.find({"message" : {$regex : `${req.body.message}`}})
    
    const jsonFile = JSON.stringify(results)
    console.log(jsonFile)

    if (results) 
    {
      return res.json(jsonFile)
    }
    return res.send([]) 
  }
  catch(e) {
    return res.status(500).send("Internal server error.")
  }
});

app.listen(port, async () => {
  await mongoose.connect(uri);
  console.log(`Server listening on http://localhost:${port}`);
});