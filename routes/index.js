const express = require('express');
const router = express.Router();
const Asso = require("../models/Assos")
const uploader = require("../config/cloudinary");

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


router.get("/assos", (req, res, next) => {
  console.log(req.body, "this is body");
  console.log(req.params, "this is req params-----");


 Asso.find({}) // --- ^
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

    // console.log(req.file, "you are here ------------")
    console.log(req.body, "before ------------")

    if (req.file) {
      req.body.image = req.file.path;
    }
    console.log(req.body, "after ------------")

    try {
      const dbResult = await Asso.create(newAsso);
      res.redirect("/assos");
    } catch (error) {
      next(error);
    }
    
  }
);


module.exports = router;
