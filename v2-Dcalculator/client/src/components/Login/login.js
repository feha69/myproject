import axios from "axios";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./login.css";

function Login() {
    const navigate = useNavigate();
    const [flag, setFlag] = useState(1);
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    flag && axios.post("/check")
    .then( res => {
        if(res.data.message !== "authenticated") {
            navigate("/");
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
            <div className="flex-container">
  <div className="content-container">
    <div className="form-container">
      <form action="/action_page.php">
        <h1>
          Login
        </h1>
        <br />
        <br />
        <span className="subtitle">USERNAME:</span>
        <br />
        <input name="username" onChange={handleChange} value={user.username} />
        <br />
        <span className="subtitle">PASSWORD:</span>
        <br />
        <input name="password" onChange={handleChange} value={user.password} />
        <br />
        <button type="button" class="btn btn-primary" onClick={handleClick}>Login</button>
        <button type="button" class="btn btn-primary" onClick={() => navigate("/register")}>Register</button>
      </form>
    </div>
  </div>
</div> 
    );
}

export default Login;

