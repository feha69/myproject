import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Home from "./components/Home/home";
import Login from "./components/Login/login";
import Register from "./components/Register/register";
import Header from "./components/Header/header";

function App() {


  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
export default App;
