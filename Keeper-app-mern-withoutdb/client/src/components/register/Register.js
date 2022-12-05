import React, {useState} from "react";
import axios from "axios";
import "./Register.css";
import { useNavigate } from "react-router-dom";


const Register = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        reEnterPassword: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleClick = (e) => {
        const {name, email, password, reEnterPassword} = user;
        if(name && email && password && (password === reEnterPassword)) {
            alert("registered!");
            axios.post("http://localhost:9002/register", user)
            .then(res => {
                alert(res.data.message);
                navigate("/Home", {state: {email: user.email, password: user.password}});
            });
        } else {
            alert("Invalid Input");
        }
    }

    return (
        <div className="register">
        <h1>Register</h1>
        <input type="text" name="name" value={user.name} placeholder="Enter Name" onChange={handleChange} ></input> 
        <input type="text" name="email" value={user.email} placeholder="Enter Email" onChange={handleChange} ></input>
        <input type="password" name="password" value={user.password} placeholder="Enter Password" onChange={handleChange} ></input>
        <input type="password"  name="reEnterPassword" value={user.reEnterPassword} placeholder="Re-enter Password"  onChange={handleChange}></input>
        <div className="button" onClick={handleClick}>Register</div>
        <div>or</div>
        <div className="button" onClick={()=>navigate("/")}>Login</div>
        </div>
    );
}

export default Register;