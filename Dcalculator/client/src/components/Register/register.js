import axios from "axios";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";


function Register() {
    const navigate = useNavigate();
    const [flag, setFlag] = useState(1);
    const [user, setUser] = useState({
        username: "",
        password: "",
        repassword: ""
    });

    flag && axios.post("/check")
    .then( res => {
        if(res.data.message !== "authenticated") {
            navigate("/register");
        }
        else {
            navigate("/home");
        }
        setFlag(0);
    });

    function handleChange(event) {
        const {name, value} = event.target;
        setUser({
            ...user,
            [name]: value
        });
    }

    function handleClick() {
        if(user.username && user.password && user.repassword) {
            if(user.password === user.repassword) {
                axios.post("/register", {username: user.username, password: user.password})
                .then(res => {
                    if(res.data.message === "Successfully registered") {
                        alert("Successfully registered");
                        navigate("/");
                    }
                    else {
                        alert(res.data.message);
                    }
                })
            }
            else {
                alert("Enter correct password");
            }
        }
        else {
            alert("Please enter valid input");
        } 
    }

    return (
        <div>
            <input className="username" name="username" placeholder="username" onChange={handleChange} value={user.username}></input><br />
            <input className="password" name="password" placeholder="Enter password" onChange={handleChange} value={user.password}></input><br />
            <input className="repassword" name="repassword" placeholder="Re-enter password" onChange={handleChange} value={user.repassword}></input><br />
            <button onClick={handleClick}>register</button>
            <button onClick={() => navigate("/")}>login</button>
        </div>
    );
}

export default Register;