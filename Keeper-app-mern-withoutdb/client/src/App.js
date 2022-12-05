import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Header from './components/Header/Header';
import Register from './components/register/Register';
import Login from './components/Login/Login';
import Home from './components/Home/Home';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>      
      {/* <Register /> */}
    </Router>
  );
}

export default App;
