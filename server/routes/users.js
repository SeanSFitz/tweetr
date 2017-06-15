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
        res.status(201).send(user);
      }
    });
  });

  userRoutes.delete("/:userID", function(req, res) {
  });

  return userRoutes;

}
