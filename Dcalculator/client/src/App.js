import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Home/home";
import Login from "./components/Login/login";
import Register from "./components/Register/register";
import Header from "./components/Header/header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
export default App;




// import { useState } from 'react';
// import axios from "axios";
// import './App.css';


// function App() {
//   const [coordinates, setCoordinates] = useState({
//     latitude: "",
//     longitude: ""
//   });
//   const [user, setUser] = useState("")

//   function handleInput(event) {
//     setUser(event.target.value);
//     console.log(user);
//   }

//   function handleClick() {

//   }

//   return (
//     <div className="App">
//       <input onChange={handleInput}></input>
//       <button onClick={handleClick}>Search</button>
//       <button>request</button>
//       <button>give access</button>
//     </div>
//   );
// }

// export default App;

























//   // function handleClick() {
//   //   getLocation();
//   // }
//   //   // var x = document.getElementById("demo");
//   //   function getLocation() {

//   //     if (navigator.geolocation) {
//   //       navigator.geolocation.getCurrentPosition(showPosition);
//   //     } else {
//   //       alert("loacation not found");
//   //     }

//   //   function showPosition(position) {
//   //     // x.innerHTML = "Latitude: " + position.coords.latitude +
//   //     // "<br>Longitude: " + position.coords.longitude;
//   //     setCoordinates({
//   //       latitude: position.coords.latitude,
//   //       longitude: position.coords.longitude
//   //     }); 
//   //     axios.post("/", coordinates)
//   //     .then((res) => {
//   //       alert(res.data.message);
//   //     });
//   //   }
//   // }
