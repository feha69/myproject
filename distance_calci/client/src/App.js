import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./comoponent/Register/Register";
import Home from "./comoponent/Home/Home";
import Login from "./comoponent/Login/Login";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
    
  );
}

export default App;
