// models/message.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  roomName: { type: String, required: true },
  nickname: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
