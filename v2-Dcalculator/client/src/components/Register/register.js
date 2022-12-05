import axios from "axios";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./register.css"


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
        <div className="flex-container">
        <div className="content-container">
          <div className="form-container">
            <form action="/action_page.php">
              <h1>
                Register
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
              <span className="subtitle">Re-Enter PASSWORD:</span>
              <br />
              <input name="repassword" onChange={handleChange} value={user.repassword} />
              <br />
              <button type="button" class="btn btn-primary" onClick={handleClick}>Register</button>
              <button type="button" class="btn btn-primary" onClick={() => navigate("/")}>Login</button>
            </form>
          </div>
        </div>
      </div> 
    );
}

export default Register;
