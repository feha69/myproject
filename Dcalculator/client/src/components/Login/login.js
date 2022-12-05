import axios from "axios";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [flag, setFlag] = useState(1);
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    // flag && axios.post("/check")
    // .then( res => {
    //     if(res.data.message !== "authenticated") {
    //         navigate("/");
    //     }
    //     else {
    //         navigate("/home");
    //     }
    //     setFlag(0);
    // });

    function handleChange(event) {
        const {name, value} = event.target;
        setUser({
            ...user,
            [name]: value
        });
    }

    function handleClick() {
        axios.post("/login", {username: user.username, password: user.password})
        .then(res => {
            if(res.data.message === "login Successfull") {
                alert("login Successfull");
                navigate("/home");
            }
            else {
                alert("Error! in Login");
            }
        });
    }

    return (
        <div>
            <input className="username" name="username" placeholder="username" onChange={handleChange} value={user.username}></input><br />
            <input className="password" name="password" placeholder="Enter password" onChange={handleChange} value={user.password}></input><br />
            <button onClick={handleClick}>login</button>
            <button onClick={() => navigate("/register")}>Register</button>
        </div>
    );
}

export default Login;