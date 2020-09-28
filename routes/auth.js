var express = require('express');
var router =  new express.Router();
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

router.get('/signup', function(req, res, next) {
    res.render('signup.hbs');
  });

module.exports = router;