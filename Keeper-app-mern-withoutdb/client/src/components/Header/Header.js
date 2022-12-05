import React, {useState} from "react";
import HighlightIcon from '@mui/icons-material/Highlight';
import "./Header.css";

function Header() {
    return (
        <header>
            <h1><HighlightIcon /> Keeper</h1>
        </header>
    );
}

export default Header;