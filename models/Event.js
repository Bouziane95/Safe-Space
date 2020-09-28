const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  Picture: String,
  Time: Date,
  Address: String,
  Description: String,
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
