const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

let port = process.env.PORT;
if (port == null || port == "") {
  port = 9002;
}

mongoose.connect('mongodb+srv://keeper:keeper@cluster0.ayr2elb.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected");
});

const noteSchema = mongoose.Schema({
    title: String,
    content: String
});

const Note = new mongoose.model("Note", noteSchema);

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    notes: [noteSchema]
});


const User = new mongoose.model("User", userSchema);

app.post("/login", (req, res) => {
    const {email, password} = req.body;
    User.findOne({email: email}, (err, user)=> {
        if(user) {
            if(user.password === password) {
                res.send({message: "login Successfull", user: user})
            } else {
                res.send({message: "password didn't match"});
            }
        } else {
            res.send("User not registered");
        }
    });
});

app.post("/register", (req, res) => {
    const {name, email, password} = req.body;
    User.findOne({email: email}, (err, user) => {
        if(user) {
            res.send({message: "User already Registerd"});
        } else {
            const user = new User({
                name,
                email,
                password,
                notes: []
            });
            user.save( err => {
                if(err) {
                    res.send(err);
                } else {
                    res.send({message: "Successully Registered, please login now"});
                }
            });

        }
    })
});

app.post("/insert", (req, res) => {
    const {email, note} = req.body;
    const { title, content } = note;

    const newNote = new Note({
        title: title,
        content: content
    });

    User.findOne({email: email}, function(err, foundUser) {
        if(err) {
            console.log("error in /insert");
        }
        else {
            foundUser.notes.push(newNote);
            foundUser.save();
            // res.send({})
        }
    })
});

app.post("/home", (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            console.log(err);
        }
        else {
            res.send({notes: user.notes});
        }
    })
});

app.post("/delete", (req, res) => {
    const noteId = req.body.id;
    const emailId = req.body.email;

    User.findOneAndUpdate({email: emailId}, {$pull: {notes: {_id: noteId}}}, function(err, foundUser) {
        if(err) {
            console.log("error in /delete");
        } else {
            console.log("Successfully removed");
        }
    });
    
});

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
    });
}

app.listen(port, function() {
  console.log("Server has started Successfully on " + port);
});

