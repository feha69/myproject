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

mongoose.connect('mongodb://localhost:27017/authentication', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected");
});

const userSchema = mongoose.Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// app.post("/", (req, res) => {

// });




app.post("/register", (req, res) => {
    const { username, password} = req.body;
    User.findOne({username: username}, (err, user) => {
        if(user) {
            res.send({message: "user already Registered"});
            console.log("user already Registered");
        }
        else {
            User.register({username: username}, password, function(err, user){
                if(err) {
                    console.log(err);
                    console.log("err");
                }
                else {
                    passport.authenticate("local")(req, res, function() {
                        res.send({message: "Successfully registered"});
                        console.log("Successfully registered");
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

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + "/client/build/index.html"));
    });
}

app.listen(port, function () {
    console.log("Server has started Successfully on " + port);
});
