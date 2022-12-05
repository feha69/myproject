import axios from "axios";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../Popup/popup.js";
import "./home.css";

function Home() {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [usernamefound, setUsernamefound] = useState("");
    const [flag1, setFlag1] = useState(true);
    const [flag2, setFlag2] = useState(false);
    const [temp, setTemp] = useState(false);
    const [ready, setReady] = useState(false);
    const [checkforacceptFlag, setCheckforacceptFlag] = useState(true);
    const [distance, setDistance] = useState(0);
    const [showDistance, setShowDistance] = useState(false);
    const [requestPopup, setRequestPopup] = useState(false);

    axios.post("/check", {username: usernamefound})
    .then( res => {
        if(res.data.message !== "authenticated") {
            navigate("/");
        }
    });


    flag1 && axios.post("/checkforrequest")
    .then( res => {
        if(res.data.message === "requested") {
            alert("request from " + res.data.username);
            setFlag2(true);
            setFlag1(false);
        }
    });

    checkforacceptFlag && axios.post("/checkforaccept")
    .then(res => {
        if(res.data.message === "accepted") {
            setReady(true);
        }
        setCheckforacceptFlag(false);
    });

    ready && axios.post("/getcoordinates") 
    .then(res => {
        setTemp(true);
        getLocation();
        function getLocation() {

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                alert("loacation not found");
            }
        
            function showPosition(position) {
            // x.innerHTML = "Latitude: " + position.coords.latitude +
            // "<br>Longitude: " + position.coords.longitude;
            setReady(false);
            alert("calulating distance");
            setShowDistance(true);
            setDistance(calcCrow(position.coords.latitude, position.coords.longitude, res.data.latitudeR, res.data.longitudeR));
            }
        }
    });

    function calcCrow(lat1, lon1, lat2, lon2) 
    {
        console.log(lat1+ " " + lon1 + "  " + lat2 + " " + lon2);
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }

    function handleChange(event) {
        setUsername(event.target.value);
    }

    function clickForSearch() {
        axios.post("/search", {username: username})
        .then(res => {
            if(res.data.message === "found") {
                alert("User exist");
                setTemp(true);
                setUsernamefound(res.data.username);
            }
            else {
                alert("User not exist");
            }
        });
    }

    function clickForRequest() {
        axios.post("/request", {username: usernamefound})
        .then(res => {
            alert(res.data.message);
        });
    }

    function clickForRejectRequest() {
        axios.post("/rejectrequest") 
        .then(res => {
            alert(res.data.message);
        });
    }

    function clickForAccept() {
        getLocation();
        setFlag2(false);
    }

    function getLocation() {

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else {
          alert("loacation not found");
        }
  
      function showPosition(position) {
        // x.innerHTML = "Latitude: " + position.coords.latitude +
        // "<br>Longitude: " + position.coords.longitude;
        // setCoordinates({
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude
        // }); 
        axios.post("/storecoordinates", {latitude: position.coords.latitude, longitude: position.coords.longitude})
        .then((res) => {
          alert(res.data.message);
        });
      }
    }
    return (
        <>
        <div className="wrap">
            <div className="search">
                {/* popup */}
                <input className="searchTerm" name="username" placeholder="What are you looking for?" onChange={handleChange} />
                <button className="searchButton" onClick={clickForSearch}>
                    <i className="fa fa-search"></i>
                </button>
            </div>
        </div>
        <div className="working">
            {temp && <h2>Click for request to {usernamefound}</h2>}
            {temp && <div><button onClick={clickForRequest}>request</button><button onClick={clickForRejectRequest}>reject Request</button></div> }<br />
            {flag2 && <div><button onClick={clickForAccept}>accept</button><button onClick={() => setFlag2(false)}>reject</button></div>}<br />
            {showDistance && <div>{distance>=1 ? <h1>distance: {distance}km</h1> : <h1>distance: {1000*distance} meter</h1>}<br /><button onClick={()=>{setShowDistance(false)}}>stop calculating distance</button></div>}
        </div>
     </>
        
    );
}

export default Home;


// {showDistance && <div><h1>{distance}km</h1><br /><button onClick={()=>{setShowDistance(false)}}>stop calculating distance</button></div>}

