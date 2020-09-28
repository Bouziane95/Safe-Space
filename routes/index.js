var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const salt = 10;
const Asso = require("../models/Assos")
const uploader = require("../config/cloudinary");

//MODEL
const UserModel = require("../models/User");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('map');
});

router.get('/testimonials', function(req, res, next) {
  res.render('testimonials');
});

router.get('/events', function(req, res, next) {
  res.render('events');
});


router.get("/associations", (req, res, next) => {
  console.log(req.body, "this is body");
  console.log(req.params, "this is req params-----");


 Asso.find({})
   .then((dbResult) => {
     res.render("assos.hbs", { assos: dbResult });
   })
   .catch((error) => {
     next(error);
   });
});

router.get("/createAsso", (req, res, next) => {
  res.render("create_form_asso");
});


router.post("/createAsso", uploader.single("image"),

  async (req, res, next) => {

    const newAsso = req.body;

    if (req.file) {
      req.body.image = req.file.path;
    }

    try {
      const dbResult = await Asso.create(newAsso);
      res.redirect("/assos");
    } catch (error) {
      next(error);
    }
    
  }
);


////////////
// AUTH ROUTES

router.get('/signin', function(req, res, next) {
  res.render('signInUser');
});

router.get('/signin', function(req, res, next) {
  res.render('signUpUser');
});

router.get('/signup', function(req, res, next) {
  res.render('choiceSignup');
});

router.get('/signin', function(req, res, next) {
  res.render('choiceSignin');
});

///////////
//AUTH CHOICES

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
