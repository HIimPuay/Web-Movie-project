// client/src/components/Navbar.js
import React from 'react';
import './styles/Navbar.css';
import { Link } from "react-router-dom";
import { FaBars, FaSearch, FaBookmark, FaUser } from 'react-icons/fa';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/"><img src="path_to_logo" alt="Logo" className="logo-image" /></Link>
                <button className="menu-button">
                    <FaBars />
                    <span>MENU</span>
                </button>
            </div>
            <div className="navbar-search">
                <input type="text" placeholder="Search" />
                <button className="search-button">
                    <FaSearch />
                </button>
            </div>
            <div className="navbar-links">
                <button className="navbar-icon">
                    <FaBookmark />
                    <span>Playlist</span>
                </button>
                <button className="navbar-icon">
                    <FaUser />
                    <span><Link to="/Profile">Profile</Link></span>
                </button>
            </div>
        </nav>
    );
}
console.log("Footer rendered");
export default Navbar;
