import React, {useState} from "react";
import axios from "axios";
import {useLocation} from "react-router-dom";
import "./Home.css";

function Home() {
    const  [user, setUser] = useState({
        username: ""
    });
    const {state} = useLocation();
    const {username, password} = state;
    console.log(username, password);

    function handleChange(event) {
        setUser({username: event.target.value});
    }

    function handleRequest() {
        axios.post("/request", user)
        .then((res) => {

        });
    }

    function handleAccess() {

    }


    return (
        <div className="home">
            <input type="text" name="username" placeholder="Enter your username" onChange={handleChange}></input>
            <div className="button" onClick={handleRequest}>Send Request</div>
            <div className="button" onClick={handleAccess}>Give access</div>
        </div>
    );
}

export default Home;