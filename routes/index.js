var express = require("express");
var router = express.Router();
var dayjs = require('dayjs')

const bcrypt = require("bcrypt");
const salt = 10;
const uploader = require("../config/cloudinary");

//MODELS

const UserModel = require("../models/User");
const AssoModel = require("../models/Assos");
const MapEventModel = require("../models/MapEvent");
const MapEvent = require("../models/MapEvent");


///ROUTES

router.post("/map", async (req, res, next) => {
  try {
    const newEvent = req.body;
    var rightTime = dayjs(newEvent.time).format("HH:mm DD/MM/YYYY");
    newEvent.time = rightTime;

    const createdEvent = await MapEvent.create(newEvent);

    if (req.session.userType === "asso") {
      const infosAsso = await AssoModel.findByIdAndUpdate(
        req.session.currentUser._id,
        { $push: { events: createdEvent._id } }
      );
    } else if (req.session.userType === "user") {
      const infosUser = await UserModel.findByIdAndUpdate(
        req.session.currentUser._id,
        { $push: { events: createdEvent._id } }
      );
    }
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/map", async (req, res, next) => {
  try {
    const mapEvent = await MapEvent.find();
    res.send(mapEvent);
  } catch (error) {
    next(error);
    return error;
  }
});

router.get("/", function (req, res, next) {
  res.render("map");
});

router.get("/carte", function (req, res) {
  res.render("map");
});

router.get("/testimonials", function (req, res, next) {
  res.render("testimonials");
});

router.get("/events", function (req, res, next) {
  res.render("events");
});

/* GET association page. */

router.get("/associations", (req, res, next) => {

  AssoModel.find({})
    .then((dbResult) => {
      res.render("assos", { assos: dbResult });
    })
    .catch((error) => {
      next(error);
    });
});

/// GET THE INFOS OF THE ASSO/USERS AND THEIR RESPECTIVE MAP EVENTS

router.get("/mes-informations", async (req, res, next) => {
  try {
    if (req.session.userType === "asso") {
      const infos = await AssoModel.findById(
        req.session.currentUser._id
      ).populate("events");
      res.render("mes_informations", { infos });
    } else {
      const infos = await UserModel.findById(
        req.session.currentUser._id
      ).populate("events");
      res.render("mes_informationsUser", { infos });
    }
  } catch (error) {
    next(error);
  }
});

/* EDIT INFORMATIONS ASSOCIATION */

router.get("/infos-edit/:id", async (req, res, next) => {
  try {
    const infoId = req.params.id;
    const dbResult = await AssoModel.findById(infoId);
    res.render("infos_edit", { infos: dbResult });
  } catch (error) {
    next(error);
  }
});

router.post("/infos-edit/:id", uploader.single("image"),
 async (req, res, next) => {
    
    if (req.file) {
      req.body.image = req.file.path;
    }

    try {
      const infoId = req.params.id;
      const updatedInfo = await AssoModel.findByIdAndUpdate(infoId, req.body);
      res.redirect("/mes-informations");
    } catch (error) {
      next(error); 
    }
  }
);

//DELETED MAP-EVENTS DANS L'HISTORIQUE

router.get("/historique_mapEvents_row/:id/delete", async (req, res, next) => {
try {

  const mapEventsId = req.params.id;

  const deletedEvent = await MapEventModel.findByIdAndDelete(mapEventsId);

  if (req.session.userType === "asso") {
    const deletedAssoEvent = await AssoModel.findByIdAndUpdate(req.session.currentUser._id,{$pull: {events:deletedEvent._id }});
    res.redirect("/mes-informations");
  } else if 
    (req.session.userType ==="user") {
      const deletedUserEvent = await UserModel.findByIdAndUpdate(req.session.currentUser._id,{$pull: {events:deletedEvent._id }});
      res.redirect("/mes-informations");
    } else {

  res.redirect("/");
    }
} catch (error) {
  next(error);
}
});

//////////// AUTH ROUTES

////// SIGN UP

router.get("/signup", function (req, res, next) {
  res.render("choiceSignup");
});

router.get("/signUpUser", function (req, res, next) {
  res.render("signUpUser");
});

router.get("/signUpAsso", function (req, res, next) {
  res.render("signUpAsso");
});

router.post("/addUser", async (req, res, next) => {
  try {
    const newUser = req.body;
    const foundUser = await UserModel.findOne({ email: newUser.email });

    if (foundUser) {
      req.flash("error", "Un compte existe déjà à cette adresse!");
      res.render("signInUser");
    } else {
      req.flash("success", "Votre compte est crée!");
      const hashedPassword = bcrypt.hashSync(newUser.password, salt);
      newUser.password = hashedPassword;
      const user = await UserModel.create(newUser);

      res.redirect("/signInUser");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/addAsso", uploader.single("image"),
  async (req, res, next) => {

    if (req.file) {
      req.body.image = req.file.path;
    }

  try {
    const newUser = req.body;
    const foundUser = await AssoModel.findOne({ email: newUser.email });

    if (foundUser) {
      req.flash("error", "Un compte existe déjà à cette adresse!");
      res.render("signup");
    } else {
      req.flash("success", "Votre compte est crée!");
      const hashedPassword = bcrypt.hashSync(newUser.password, salt);
      newUser.password = hashedPassword;
      const user = await AssoModel.create(newUser);

      res.redirect("/signInAsso");
    }
  } catch (error) {
    next(error);
  }
});

/////// SIGN IN

router.get("/signin", function (req, res, next) {
  res.render("choiceSignin");
});

router.get("/signInUser", function (req, res, next) {
  res.render("signInUser");
});

router.get("/signInAsso", function (req, res, next) {
  res.render("signInAsso");
});

router.post("/signInUser", async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await UserModel.findOne({ email: email });
  if (!foundUser) {
    req.flash("error", "Email ou mot de passe erronné");
    res.redirect("/signInUser");
  } else {
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    if (!isSamePassword) {
      req.flash("error", "Email ou mot de passe erronné");
      res.redirect("/signInUser");
    } else {
      const userDocument = { ...foundUser };
      console.log(userDocument);
      const userObject = foundUser.toObject();
      delete userObject.password;
      req.session.currentUser = userObject;
      req.session.userType = "user"
      req.flash("success", "Successfully logged in...");
      res.redirect("/");
    }
  }
});

router.post("/signInAsso", async (req, res, next) => {
  const { email, password } = req.body;
  const foundUser = await AssoModel.findOne({ email: email });
  console.log(foundUser);
  if (!foundUser) {
    req.flash("error", "Email ou mot de passe erronné");
    res.redirect("/signInAsso");
  } else {
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    if (!isSamePassword) {
      req.flash("error", "Email ou mot de passe erronné");
      res.redirect("/signInAsso");
    } else {
      const userDocument = { ...foundUser };
      console.log(userDocument);
      const userObject = foundUser.toObject();
      delete userObject.password;
      req.session.currentUser = userObject;
      req.session.userType = "asso";
      req.flash("success", "Bienvenue!");
      res.redirect("/");
    }
  }
});

// LOGOUT

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
