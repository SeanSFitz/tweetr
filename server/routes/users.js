"use strict";

const userHelper    = require("../lib/util/user-helper");
const bcrypt        = require("bcrypt");

const express       = require('express');
const userRoutes  = express.Router();

module.exports = function(DataHelpers) {

  userRoutes.get("/", function(req, res) {
  });

  userRoutes.post("/register", function(req, res) {
    //code to format user here
    let user = {
      name: req.body.name,
      handle: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      avatars: {
        small: req.body.avatarUrl,
        regular: '',
        large: ''
      }
    }
    //call helper fuctions to add user to mongo
    DataHelpers.addUser(user, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        req.session.user = user;
        res.status(201).send(user);
      }
    });
  });

  userRoutes.post("/login", function(req, res) {

    DataHelpers.getUser(req.body.loginUsername, (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }

      if (bcrypt.compareSync(req.body.loginPassword, user.password)) {
        let userInfo = Object.assign({}, user);
        delete userInfo.password;
        req.session.user = userInfo;
        res.status(201).send(userInfo);
      }
    });
  });

  userRoutes.post("/logout", function (req, res) {
    console.log("trying to logout");
    req.session = null;
    res.status(201).send();
  });

  userRoutes.delete("/:userID", function(req, res) {
  });

  return userRoutes;

}
