"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const cookieSession = require('cookie-session');


const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cookieSession({
  name: 'session',
  secret: 'sean'
}));


const db = MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  let mongoDB = db;
  const DataHelpers = require("./lib/data-helpers.js")(mongoDB);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  const userRoutes = require("./routes/users")(DataHelpers);

  app.use("/tweets", tweetsRoutes);
  app.use("/users", userRoutes);
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
