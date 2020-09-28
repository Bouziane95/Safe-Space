const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AssosSchema = new Schema({
  Name: String,
  Address: String,
  Contact: String,
  Description: String,
});

const Assos = mongoose.model("Assos", AssosSchema);

module.exports = Event;
