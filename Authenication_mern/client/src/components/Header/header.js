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
        <nav className="navbar navbar-expand-lg  bg-light sticky-top shadow " id="mainNav">
        {/* <ToastContainer/> */}
        <div className="container px-4 py-1">

            {/* <a className="m-1" href="/"><img src={logo} alt="" /></a> */}

            <a className="navbar-brand fw-bold fs-3" style={{ letterSpacing: 2 }} onClick={() => navigate("/")}> <span
                style={{ color: "#44bb11" }}>Nutri</span>-Fit</a>

            <button className="navbar-toggler border border-white " type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse fw-semibold" id="navbarResponsive">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item"><a className="nav-link" onClick={() => {
                        axios.post("/logout")
                        .then(res => {
                            if(res.data.message === "logout successfull") {
                                navigate("/");
                                alert("logout successfull");
                            }
                            else {
                                alert("logout failed");
                            }
                        })
                    }}>Logout</a></li>
                    {/* <li className="nav-item"><a className="nav-link " onClick={() => navigate("/about")} >About</a></li>
                    <li className="nav-item"><a className="nav-link " onClick={() => navigate("/news")} >News</a></li> */}
                </ul>
            </div>
        </div>
    </nav> 
    );
}

export default Header;

