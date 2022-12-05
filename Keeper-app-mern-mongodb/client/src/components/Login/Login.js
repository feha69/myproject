import React, {useState} from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
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
                navigate("/home", {state: {email: user.email, password: user.password}});
            } else {
                alert("Incorrect email or password");
            }
        });
    }
    return (
        <div className="login">
        <h1>Login</h1>
        <input type="text" name="email" value={user.email} placeholder="Enter Email" onChange={handleChange}></input>
        <input type="password" name="password" value={user.password} placeholder="Enter Password" onChange={handleChange}></input>
        <div className="button" onClick={handleClick}>Login</div>
        <div>or</div>
        <div className="button" onClick={()=>navigate("/register")}>Register</div>
        </div>
    );
}

export default Login;