import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleClick = () => {
        axios.post("/login", user)
        .then(res => {
            if(res.data.message === "login Successfull") {
                alert(res.data.message);
                console.log(res.data.user);
                navigate("/home", {state: {username: user.username, password: user.password}});
            } else {
                alert("Incorrect email or password");
            }
        });
    }
    return (
        <div className="login">
            <h1>Login</h1>
            <input type="text" name="username" placeholder="Enter your username" onChange={handleChange}></input>
            <input type="password" name="password" placeholder="Enter your Password" onChange={handleChange}></input>
            <div className="button" onClick={handleClick}>Login</div>
            <div>or</div>
            <div className="button" onClick={() => navigate("/register")}>Register</div>
        </div>
    );
}

export default Login;