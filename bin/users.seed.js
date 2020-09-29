require("dotenv").config();
require("./../config/mongodb");

const UserModel = require("./../models/User");

const users = [
  {
    pseudo: "Ada Lovelace",
    email: "prioneer@oldschool.com",
    password: "Ada",
  },
  {
    pseudo: "Doug Crockford",
    email: "doug@wwwrrrld.com",
    password: "JS",
  },
];

UserModel.insertMany(users)
.then(dbRes => console.log(dbRes))
.catch(dbErr => console.log(dbErr));