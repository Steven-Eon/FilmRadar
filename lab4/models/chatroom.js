// models/chatroom.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatroomSchema = new Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Chatroom', chatroomSchema);
