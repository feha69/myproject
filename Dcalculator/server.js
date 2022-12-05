//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session()); 

let port = process.env.PORT;
if (port == null || port == "") {
    port = 9002;
}

mongoose.connect('mongodb+srv://Dcalculator:Dcalculator@cluster0.ozapnkp.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected");
});

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    request: Boolean,
    usernameR: String,
    latitudeR: Number,
    longitudeR: Number,
    accept: Boolean,
    latitude: Number,
    longitude: Number
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post("/", (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    // console.log(typeof(longitude));
    // console.log(latitude, longitude);
    const user = new User({
        latitude: latitude,
        longitude: longitude
    });
    user.save((err) => {
        if(err) {
            console.log("error in post /");
        }
        else {
            console.log("saved");
            res.send({message: "Success"});
        }
    });
});


app.post("/register", (req, res) => {
    const { username, password} = req.body;

    User.findOne({username: username}, (err, user) => {
        if(user) {
            res.send({message: "user already Registered"})
        }
        else {
            User.register({username: username, request: false, usernameR: "", accept: false, latitude: 0.0, longitude: 0.0, latitudeR: 0.0, longitudeR: 0.0}, password, function(err, user){
                if(err) {
                    console.log(err);
                }
                else {
                    passport.authenticate("local")(req, res, function() {
                        res.send({message: "Successfully registered"});
                    });
                }
            });
        }
    })
});

app.post("/login", (req, res) => {
    const {username, password} = req.body;

    const user = new User ({
        username: username,
        password: password
    });

    req.login(user, function(err) {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function() {
                res.send({message: "login Successfull"});
            });
        }
    });
});

app.post("/logout", (req, res) => {
    req.logout(function(err) {
        if(!err) {
            res.send({message: "logout successfull"});
        }
        else {
            console.log("error in server.js /logout");
        }
    });
});


app.post("/check", (req, res) => {
    if(req.isAuthenticated()) {
        res.send({message: "authenticated"});
    }
    else {
        res.send({message: "not authenticated"})
    }

    // check for request

});

app.post("/request", (req, res) => {
    // console.log(req.body.username);
    if(req.isAuthenticated()) {
        User.findOneAndUpdate({username: req.body.username}, {$set: {"request": true, usernameR: req.user.username}}, (err, user) => {
            if(user) {
                res.send({message: "request sent successully"})
                req.user.usernameR = req.body.username;
                req.user.save();
            }
            else {
                res.send({message: "request failed"});
            }
        })
    }
    else {
        console.log("user not authenticated");
    }
});

app.post("/rejectrequest", (req, res) => {
    if(req.isAuthenticated()) {
        User.findOneAndUpdate({username: req.user.usernameR}, {$set: {"request": false, "usernameR": ""}}, (err, user) => {
            if(user) {
                res.send({message: "request rejected"})
            }
            else {
                res.send({message: "request rejection failed"});
            }
        });
        req.user.accept = false;
        req.user.latitudeR = 0;
        req.user.longitudeR = 0;
        req.user.usernameR = "";
        req.user.save();
    }
    else {
        console.log("user not authenticated");
    }
});


app.post("/search", (req, res) =>  {
    User.findOne({username: req.body.username}, (err, user) => {
        if(user) {
            res.send({username: user.username, message: "found"});
            console.log("sent");
        }
        else {
            res.send({message: "user not found"});
        }
    })
});

app.post("/checkforrequest", (req, res) => {
    if(req.user.request === true) {
        res.send({message: "requested", username: req.user.usernameR});
    }
    else {
        res.send({message: "not requested"});
    }
});

app.post("/checkforaccept", (req, res) => {
    if(req.user.accept === true) {
        res.send({message: "accepted"});
    }
    else {
        res.send({message: "not accepted"});
    }
})

app.post("/storecoordinates", (req, res) => {
    User.findOneAndUpdate({username: req.user.usernameR}, {$set: {"accept": true, "latitudeR": req.body.latitude, "longitudeR": req.body.longitude}}, (err, user) => {
        if(err) {
            console.log("error in storing coordinates");
        }
        else {
            if(user) {
                res.send({message: "location sent successfully to " + user.username});
            }
        }
    });

});


app.post("/getcoordinates", (req, res) => {
    res.send({latitudeR: req.user.latitudeR, longitudeR: req.user.longitudeR});
});

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + "/client/build/index.html"));
    });
}

app.listen(port, function () {
    console.log("Server has started Successfully on " + port);
});
