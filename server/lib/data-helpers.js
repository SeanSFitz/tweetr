"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");
const ObjectId      = require('mongodb').ObjectID;


// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, callback);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        callback(null, tweets.sort((a, b) => {
          return b.created_at - a.created_at;
        }));
      });
    },

    deleteTweet: function(tweetID, callback) {
      db.collection("tweets").deleteOne({ _id: ObjectId(tweetID)}, (err) => {
        callback(err);
      });
    },

    addUser: function(newUser, callback) {
      db.collection("users").insertOne(newUser, (err) => {
        callback(err);
      });
    },

    getUser: function(username, callback) {
      db.collection("users").findOne({ "handle": username}, callback);
    }

  };
}
