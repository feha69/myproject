//jshint esversion:6
//  "proxy": "https://aqueous-bayou-95331.herokuapp.com",
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session"); //saving data
const passport = require("passport"); //authentication
const passportLocalMongoose = require("passport-local-mongoose"); // automatically generate hash password
const e = require('express');

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
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

mongoose.connect('mongodb://localhost:27017/exam-portall', {

    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected");
});


//schemas

const teacherSchema = mongoose.Schema({
    username: String,
    password: String
});
const studentSchema = mongoose.Schema({
    username: String,
    password: String,
    passingYear: Number
});

const subjectSchema = mongoose.Schema({
    subject: String,
    marks: Number
});

const Subject = new mongoose.model("Subject", subjectSchema);

const resultSchema = mongoose.Schema({
    username: String,
    sem: Number,
    total: [subjectSchema]
});

const Result = new mongoose.model("Result", resultSchema);

teacherSchema.plugin(passportLocalMongoose);


const Teacher = new mongoose.model("Teacher", teacherSchema);
const Student = new mongoose.model("Student", studentSchema);

passport.use(Teacher.createStrategy());


passport.serializeUser(Teacher.serializeUser());
passport.deserializeUser(Teacher.deserializeUser());

// passport.serializeUser(Student.serializeUser());
// passport.deserializeUser(Student.deserializeUser());


// studentSchema.plugin(passportLocalMongoose)
// passport.use(Student.createStrategy());
// passport.serializeUser(Student.serializeUser());
// passport.deserializeUser(Student.deserializeUser());



// end of Schema


// main code

app.post("/teacherregister", (req, res) => {
    const { username, password} = req.body;

    Teacher.findOne({username: username}, (err, teacher) => {
        if(teacher) {
            res.send({message: "teacher already Registered"})
        }
        else {
            Teacher.register({username: username}, password, function(err, teacher){
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
    });
});


app.post("/teacherlogin", (req, res) => { //teacherlogin
    console.group("Suraj log")
    const {username, password} = req.body;

    const teacher = new Teacher ({
        username: username,
        password: password
    });

    req.login(teacher, function(err) {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function() {
                res.send({message: "login Successfull"});
            });
        }
    });
});

app.post("/insertstudent", (req, res) => {
    if(req.isAuthenticated()) {
        const {username, password, passingYear} = req.body;
        Teacher.findOne({username: username}, (err, student) => {
            if(student) {
                res.send({message: "student already Registered"})
            }
            else {
                // Student.register({username: username, passingYear: passingYear}, password, function(err, teacher){
                //     if(err) {
                //         console.log(err);
                //     }
                //     else {
                //         res.send({message: "Successfully Inserted"});
                //     }
                // });
                const student = new Student ({
                    username: username,
                    password: password,
                    passingYear: passingYear
                });
                student.save(err => {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        res.send({message: "Successfully Inserted"});
                    }
                });
            }
        });
    }
    else {
        res.send({message: "not authenticated"})
    }
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

app.post("/checkforauthentication", (req, res) => {
    if(req.isAuthenticated()) {
        res.send({message: "authenticated"});
    }
    else {
        res.send({message: "not authenticated"})
    }
})


app.post("/insert-marks", (req, res) => {
    const {username, sem, subject, marks} = req.body;
    const subjects = new Subject ({
        subject: subject,
        marks: marks
    });
    Result.findOne({username: username, sem: sem}, function(err, foundResult){
        if(err) {
            console.log("error in insert marks");
        }
        else if(foundResult) {
            foundResult.total.push(subjects);
            foundResult.save();
            res.send({message: "Mark Inserted"});
        }
        else {
            const result = new Result({
                username: username,
                sem: sem,
                total: [subjects]
            });
            result.save(err => {
                if(err) {
                    console.log("error in saving result in insert marks");
                }
                else {
                    res.send({message: "result saved successfully"});
                }
            })
        }
    })
});

app.post("/studentlogin", (req, res) => {
    const {username, password} = req.body;
    Student.findOne({username: username, password: password}, (err, foundStudent) => {
        if(err) {
            console.log("error in studentlogin");
        }
        else if(foundStudent) {
            res.send({message: "login Successfull"});
        }
        else {
            res.send({message: "Username or password is wrong"});
        }
    });
});

app.post("/getresult", (req, res) => {
    const {username} = req.body;
    Result.find({username: username}, (err, found) => {
        if(err) {
            console.log("error in /getresult");
        }
        else if(found) {
            res.send({message: "success", result: found});
        }
        else {
            res.send({message: "user not found"});
        }
    });
});


// end of main code



//code for setting port
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + "/client/build/index.html"));
    });
}

app.listen(port, function () {
    console.log("Server has started Successfully on " + port);
});