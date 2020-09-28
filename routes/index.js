var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const salt = 10;

//MODEL
const UserModel = require("../models/User");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('map');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/signin', function(req, res, next) {
  res.render('signin');
});

router.post("/addUser", async (req, res, next) => {
  try {
    const newUser = req.body;
    const foundUser = await UserModel.findOne({ email: newUser.email });

    if (foundUser) {
      req.flash("error", "invalid credentials");
      res.render("signup");
    } else {
      req.flash("success", "Yay, you have an account!");
      const hashedPassword = bcrypt.hashSync(newUser.password, salt);
      newUser.password = hashedPassword;
      const user = await UserModel.create(newUser);
      
      res.redirect("/signin");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  const foundUser = await UserModel.findOne({ email: email });
  console.log(foundUser);
  if (!foundUser) {
    req.flash("error", "Invalid credentials");
    res.redirect("/signin");
  } else {
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    if (!isSamePassword) {
      req.flash("error", "You're in!");
      res.redirect("/signin");
    } else {
      const userDocument = { ...foundUser };
      console.log(userDocument);
      const userObject = foundUser.toObject();
      delete userObject.password;
      req.session.currentUser = userObject;
      req.flash("success", "Successfully logged in...");
      res.redirect("/");
    }
  }
});


module.exports = router;