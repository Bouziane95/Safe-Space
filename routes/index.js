const express = require('express');
const router = express.Router();
const Asso = require("../models/Assos");
const MapEvent = require("../models/MapEvent");
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

router.get("/gestion-evenements", (req, res, next) => {

 MapEvent.find({}) // --- ^
   .then((dbResult) => {
     res.render("map_events_manage", { mapEvents: dbResult });
   })
   .catch((error) => {
     next(error);
   });
});

router.get("/dashboard_mapEvents_row/:id/delete", (req, res, next) => {

  const mapEventsId = req.params.id;
  MapEvent.findByIdAndDelete(mapEventsId)
    .then((dbResult) => {
      res.redirect("/gestion-evenements"); // Redirect to "/labels" after delete is successful
    })
    .catch((error) => {
      next(error); // Sends us to the error handler middleware in app.js if an error occurs
    });
});


module.exports = router;
