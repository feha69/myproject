//jshint esversion:6
require('dotenv').config();  // for environment variable
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// for cookies and session
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
//for auth google strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//findOrCreate
const findOrCreate = require('mongoose-findorcreate');
//for oauth facebook strategy
// const FacebookStrategy = require("passport-facebook");



const app = express();
// console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

// tell app to use session
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize()); // tell app to use passport
app.use(passport.session());  // tell our app to use passport to setup a sission

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

//schema must be standard
const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

//adding plugin // use to hash and salt our password and to save our user in mongodb database.
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

// serialize and deserialize
passport.use(User.createStrategy());
//serialize and deserialize for google login
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//configure stategy code
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    // find or create means if google id exist the find, if not then create
    User.findOrCreate({ googleId: profile.id, username: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_APP_ID,
//     clientSecret: FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:3000/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));





app.get("/", function(req, res) {
  res.render("home");
});

//we are saying that use passport to authenticate user using google stategy
//scope is for -> what we want is google profile
app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect secret page.
    res.redirect('/secrets');
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/secrets", function(req, res) {
  User.find({secret: {$ne: null}}, function(err, foundUsers) {
    if(err) {
      console.log(err);
    }
    else {
      if(foundUsers) {
        res.render("secrets", {usersWithSecrets: foundUsers});
      }
    }
  });
});

app.get("/submit", function(req, res) {
  if(req.isAuthenticated()) {
    res.render("submit");
  }
  else {
    res.redirect("/login");
  }
});

app.get('/logout', function(req, res){
  req.logout(function(err) {
    if(!err) {
      res.redirect('/');
    }
  });
});






app.post("/submit", function(req, res) {
  const submittedSecret = req.body.secret;
  User.findById(req.user.id, function(err, foundUser) {
    if(err) {
      console.log(err);
    }
    else {
      if(foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function() {
          res.redirect("/secrets");
        });
      }
    }
  });
  // console.log(req.user);
});

//salting and hashing done by passport-local-mongoose
app.post("/register", function(req, res) {

  User.register({username: req.body.username}, req.body.password, function(err, user) { // this .register() comes from passport-local-mongoose
    if(err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });

});

app.post("/login", function(req, res) {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  // we are going to use passport to login this user and authenticate them
  req.login(user, function(err) { // this comes from passport
    if(err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });

});





app.listen("3000", function() {
  console.log("Server started on port 3000.");
});
