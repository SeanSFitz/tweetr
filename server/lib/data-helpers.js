"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");
var ObjectId = require('mongodb').ObjectID;


// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, (err) => {
        callback(err);
      });
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

      console.log("Trying to delete a tweet");
      db.collection("tweets").deleteOne({ _id: ObjectId(tweetID)}, (err) => {
        callback(err);
      });
    }

  };
}
