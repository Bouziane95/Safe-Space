var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const salt = 10;
const uploader = require("../config/cloudinary");
//MODELS
const UserModel = require("../models/User");
const AssoModel = require("../models/Assos");
const MapEventModel = require("../models/MapEvent");
const MapEvent = require("../models/MapEvent");

router.post("/map", async (req, res, next) => {
  try {
    const newEvent = req.body;
    const createdEvent = await MapEvent.create(newEvent);
    //Mettre createdEvent dans le redirect pour crée ensuite un object avec les coordonnes et le donner au front
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

router.get('/', function(req, res, next) {
  res.render('map');
});

router.get("/map", function (req, res) {
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
  console.log(req.body, "this is body");
  console.log(req.params, "this is req params-----");

 AssoModel.find({})
   .then((dbResult) => {
     res.render("assos", { assos: dbResult });
   })
   .catch((error) => {
     next(error);
   });
});


/* GET create association page. */
// router.get("/createAsso", (req, res, next) => {
//   res.render("create_form_asso");
// });


// router.post("/createAsso", uploader.single("image"),

//   async (req, res, next) => {

//     const newAsso = req.body;

//     if (req.file) {
//       req.body.image = req.file.path;
//     }

//     try {
//       const dbResult = await Asso.create(newAsso);
//       res.redirect("/assos");
//     } catch (error) {
//       next(error);
//     }
    
//   }
// );

// router.get("/one-product/:id", (req, res, next) => {
  
//   const sneakerId = req.params.id;
//   Sneaker.findById(sneakerId)
//     .then((dbResult) => {
//       res.render("one_product",  { sneakers: dbResult }); 
//     })
//     .catch((error) => {
//       next(error); 
//     });
// });

/* GET page mes informations */

// router.get("/mes-informations", (req, res) => {
//   res.render("mes_informations");
// });

router.get("/mes-informations", (req, res, next) => {

 MapEventModel.find({}) // --- ^
   .then((dbResult) => {
     res.render("mes_informations", { mapEvents: dbResult });
   })
   .catch((error) => {
     next(error);
   });
});

router.get("/historique_mapEvents_row/:id/delete", (req, res, next) => {

  const mapEventsId = req.params.id;
  MapEventModel.findByIdAndDelete(mapEventsId)
    .then((dbResult) => {
      res.redirect("/mes-informations"); // Redirect to "/labels" after delete is successful
    })
    .catch((error) => {
      next(error); // Sends us to the error handler middleware in app.js if an error occurs
    });
});


// router.get("/one-product/:id", (req, res) => {
//   res.render("one_product");
// });





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
      req.flash("error", "You already have an account");
      res.render("signInUser");
    } else {
      req.flash("success", "Yay, you have an account!");
      const hashedPassword = bcrypt.hashSync(newUser.password, salt);
      newUser.password = hashedPassword;
      const user = await UserModel.create(newUser);

      res.redirect("/signInUser");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/addAsso", async (req, res, next) => {
  try {
    const newUser = req.body;
    const foundUser = await AssoModel.findOne({ email: newUser.email });

    if (foundUser) {
      req.flash("error", "You already have an account");
      res.render("signup");
    } else {
      req.flash("success", "Yay, you have an account!");
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
  console.log(foundUser);
  if (!foundUser) {
    req.flash("error", "Invalid credentials");
    res.redirect("/signInUser");
  } else {
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    if (!isSamePassword) {
      req.flash("error", "Invalid Credentials");
      res.redirect("/signInUser");
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

router.post("/signInAsso", async (req, res, next) => {
  const { email, password } = req.body;
  const foundUser = await AssoModel.findOne({ email: email });
  console.log(foundUser);
  if (!foundUser) {
    req.flash("error", "Invalid credentials");
    res.redirect("/signInAsso");
  } else {
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    if (!isSamePassword) {
      req.flash("error", "Invalid Credentials");
      res.redirect("/signInAsso");
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
