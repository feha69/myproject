import React, { useState } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import CreateArea from "./components/CreateArea";
import Note from "./components/Note";
import "./Home.css";


const Home = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const {state} = useLocation();
    const {email, password} = state;
    axios.post("/home", {email: email})
    .then(res => {
        setNotes(res.data.notes);
    });

    function onDelete(id) {
        axios.post("/delete", {email: email, id: id})
        .then(res => {
            setNotes(res.data.notes);
            console.log(res.data.notes);
        })
    }

    return (
        <div>
            <CreateArea email={email} password={password} />
            {notes.map((noteItem, index) => {
                return(
                    <Note id={noteItem._id} title={noteItem.title} content={noteItem.content} onDelete={onDelete} />
                ); 
            })}
            <LogoutIcon className="logout" onClick={()=> {
                navigate("/");
            }}/>
        </div>
    );
}

export default Home;