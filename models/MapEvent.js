const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MapEventSchema = new Schema({
  time: Date,
  address: String,
  coordinates: {
    latitude: Number,
    longitude: Number,
},
  details: String,
});

const MapEvent = mongoose.model("MapEvent", MapEventSchema);

module.exports = MapEvent;