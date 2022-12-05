import React, {useState} from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import "./CreateArea.css";

function CreateArea(props) {
    const [note, setNote] = useState({
        title: "",
        content: ""
    });

    const [clicked, setClick] = useState(false); 

    function handleChange(event) {
        const {name, value} = event.target;
        setNote({
            ...note,
            [name]: value
        });
    }

    function submitNote(event) {
        axios.post("http://localhost:9002/insert", {note: note, email: props.email});
        setNote({
            title: "",
            content: ""
        });
        event.preventDefault();
    }

    function handleClick() {
        setClick(true);
    }

    return (
        <div onClick={handleClick}>
            <form className="create-note">
                {clicked && <input 
                    name="title"
                    onChange={handleChange}
                    value={note.title}
                    placeholder="Title"
                />}
                <textarea 
                    name="content"
                    onChange={handleChange}
                    value={note.content}
                    placeholder="Take a note..."
                    rows={clicked ? "3": "1"}
                />
                <Zoom in={clicked}>
                    <Fab onClick={submitNote}>
                        <AddIcon />
                    </Fab>
                </Zoom>
            </form>
        </div>
    );
}

export default CreateArea;