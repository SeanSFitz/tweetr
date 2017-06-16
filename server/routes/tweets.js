"use strict";

const userHelper    = require("../lib/util/user-helper");
const moment        = require('moment-timezone');

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = req.session.user ? req.session.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err, newTweet) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(newTweet);
      }
    });
  });

  tweetsRoutes.delete("/:tweetID", function(req, res) {
    DataHelpers.deleteTweet(req.params.tweetID, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  tweetsRoutes.put("/like/:tweetID", function (req, res) {
    //check if user is logged in
    if (!req.session.user) {
      res.status(500).json({error: "Only logged in users can like tweets."});
      return;
    }

    DataHelpers.likeTweet(req.params.tweetID, req.session.user._id, (err, tweet) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(tweet);
      }
    })
  });

  tweetsRoutes.put("/unlike/:tweetID", function (req, res) {
    //check if user is logged in
    if (!req.session.user) {
      res.status(500).json({error: "Only logged in users can unlike tweets."});
      return;
    }

    DataHelpers.unlikeTweet(req.params.tweetID, req.session.user._id, (err, tweet) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(tweet);
      }
    })
  });


  return tweetsRoutes;

}
