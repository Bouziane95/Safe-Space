var express = require('express');
var router =  new express.Router();
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

router.get('/signin', function(req, res, next) {
    res.render('assos/signin.hbs');
  });

module.exports = router;