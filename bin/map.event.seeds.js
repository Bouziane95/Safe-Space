require("dotenv").config();
require("./../config/mongodb");

const mongoose = require("mongoose");
const MapEventModel = require("../models/MapEvent");

const mapEvents = [
  {
    time: "2019-01-31",
    address: "1 rue du pont, 75015 PARIS",
    coordinates: {
        latitude: 14,
        longitude: 65,
    },
    details: "details de l'événement 1"
  },
  {
    time: "2020-12-04",
    address: "64 bd Rey, 75019 PARIS",
    coordinates: {
        latitude: 55,
        longitude: 106,
    },
    details: "details de l'événement 2"
  },
];

// Asso.insertMany(users)
// .then(dbRes => console.log(dbRes))
// .catch(dbErr => console.log(dbErr));


mongoose
.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then((self) => {
  MapEventModel.create(mapEvents)
    .then((dbResult) => {
      console.log(dbResult);
    })
    .catch((error) => {
      console.log(error);
    });
})
.catch((error) => {
  console.log(error);
});