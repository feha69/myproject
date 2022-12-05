import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        reEnterPassword: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleClick = () => {
        const {username, email, password, reEnterPassword} = user;
        if(username && email && password && (password === reEnterPassword)) {
            alert("posted");
            axios.post("http://localhost:9002/register", user)
            .then(res => {
                alert(res.data.message);
                navigate("/home", {state: {username: user.username, password: user.password}});
            });
        } else {
            alert("Invalid Input");
        }
    }

    return (
        <div className="register">
            <h1>Register</h1>
            <input type="text" name="username" value={user.username}  placeholder="Enter Username" onChange={handleChange} ></input> 
            <input type="text" name="email" value={user.email} placeholder="Enter Email" onChange={handleChange} ></input>
            <input type="password" name="password" value={user.password} placeholder="Enter Password" onChange={handleChange} ></input>
            <input type="password"  name="reEnterPassword" value={user.reEnterPassword} placeholder="Re-enter Password" onChange={handleChange} ></input>
            <div className="button" onClick={handleClick}>Register</div>
            <div>or</div>
            <div className="button" onClick={() => navigate("/")}>Login</div>
        </div>
    );
}

export default Register;