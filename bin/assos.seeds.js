require("dotenv").config();
require("./../config/mongodb");

const mongoose = require("mongoose");
const Asso = require("../models/Assos");

const assos = [
  {
    name: "Asso 1",
    address: "1 rue du chateau, 75015 PARIS",
    tel: "0145025436",
    email: "asso@asso.asso",
    description: "Asso description",
    link: "http://www.asso.fr",
    password: "123",
    image: "https://res.cloudinary.com/lcdevicloud/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1601218680/sample.jpg",
  },
  {
    name: "Asso 2",
    address: "45 rue Toto, 75018 PARIS",
    tel: "0645228875",
    email: "asso2@asso2.asso2",
    description: "Asso2 description",
    link: "http://www.asso2.fr",
    password: "789",
    image: "https://res.cloudinary.com/lcdevicloud/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1601218680/sample.jpg",
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
    Asso.create(assos)
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