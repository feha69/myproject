import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './header.css';

function Header(props) {

    const navigate = useNavigate();
    const [once, setOnce] = useState(true);
    const [logoutFlag, setLogoutFlag] = useState(false);


    once && axios.post("/check")
    .then(res => {
        if(res.data.message === "authenticated") {
            setLogoutFlag(true);
        }
        else {
            setLogoutFlag(false);
        }
    });

    function handleClick() {
        axios.post("/logout")
        .then(res => {
            if(res.data.message === "logout successfull") {
                alert("logout successfull");
                navigate("/");
            }
            else {
                alert("logout error");
            }
        });
    }


    return (
        <nav>
            <header className="header">
                <h1 className="logo"><a href="/#">D-calculator</a></h1>
                {logoutFlag && <ul  onClick={handleClick} className="main-nav">
                    <li><a href="/#">logout</a></li>
                </ul>}
            </header>
        </nav>
    );
}

export default Header;