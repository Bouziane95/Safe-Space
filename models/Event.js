const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  picture: String,
  time: String,
  address: String,
  description: String,
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
