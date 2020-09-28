require("dotenv").config();
require("./../config/mongodb");

const UserModel = require("./../models/User");

const users = [
  {
    name: "Ada Lovelace",
    email: "prioneer@oldschool.com",
    favoriteLanguage: "Ada",
  },
  {
    name: "Doug Crockford",
    email: "doug@wwwrrrld.com",
    favoriteLanguage: "JS",
  },
  {
    name: "Jill Fresh",
    email: "bill@bill.bill",
    favoriteLanguage: "CSS",
  },
  {
    name: "Tina Hype",
    email: "tina@hipster.io",
    favoriteLanguage: "Go",
  },
  {
    name: "Lou Fast",
    email: "gonna@getsome.org",
    favoriteLanguage: "Rust",
  },
  {
    name: "Jim Struggles",
    email: "intern@corporate.biz",
    favoriteLanguage: "Java",
  },
  {
    name: "Kim Brain",
    email: "functor@monad.dev",
    favoriteLanguage: "Haskel",
  },
];

UserModel.insertMany(users)
.then(dbRes => console.log(dbRes))
.catch(dbErr => console.log(dbErr));
