const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mapEventSchema = new Schema({
  time: Date,
  address: String,
  coordinates: {
    latitude: Number,
    longitude: Number,
},
  details: String,
});

const MapEvent = mongoose.model("MapEvent", mapEventSchema);

module.exports = MapEvent;