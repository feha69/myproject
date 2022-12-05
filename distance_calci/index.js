const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/myLocation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected");
});

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    latitude: Number,
    longitude: Number,
    location: Boolean,
    request: Boolean
});

const User = new mongoose.model("User", userSchema);

//Routes
app.post("/login", (req, res) => {
    const {username, password} = req.body;
    console.log(req.body);
    User.findOne({username: username}, (err, user)=> {
        if(user) {
            if(user.password === password) {
                res.send({message: "login Successfull"})
            } else {
                res.send({message: "password didn't match"});
            }
        } else {
            res.send("User not registered");
        }
    })
});

app.post("/register", (req, res) => {
    const {username, email, password} = req.body;
    User.findOne({username: username}, (err, user) => {
        if(user) {
            res.send({message: "User already Registerd"});
        } else {
            const user = new User({
                username,
                email,
                password,
                latitude: 0,
                longitude: 0,
                location: false,
                request: false
            });
            user.save( err => {
                if(err) {
                    res.send(err);
                } else {
                    res.send({message: "Successully Registered, please login now", user: user});
                }
            });
        }
    })
});

app.post("/request", (req, res) => {
    const {username} = req.body;
    // User.find({username: username}, (err, user) {
    //     if(err) {
    //         console.log("error in /request");
    //     }
    //     else {

    //     }
    // });

});

app.listen(9002, () => {
    console.log("BE started at port 9002");
});
