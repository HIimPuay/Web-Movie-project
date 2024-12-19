import React, { useState } from 'react';
import './styles/Navbar.css';
import { Link } from "react-router-dom";
import { FaBars, FaSearch, FaUser } from 'react-icons/fa';
import axios from 'axios';

function Navbar({ isLoggedIn, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // For loading state
    const [error, setError] = useState(null); // For error state

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return; // Prevent empty searches

        setIsLoading(true); // Set loading to true
        setError(null); // Clear previous errors
        setSearchResults([]); // Clear previous results

        try {
            const response = await axios.get(`http://localhost:8080/api/movies/search?q=${searchQuery}`);
            setSearchResults(response.data);
        } catch (err) {
            console.error('Error fetching search results:', err);
            setError('Unable to fetch search results. Please try again.');
        } finally {
            setIsLoading(false); // Set loading to false
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/"><img src="/src/assets/logo.svg" alt="Logo" className="logo-image" /></Link>
            </div>
            <div className="navbar-search">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="search-button" type="submit">
                        <FaSearch />
                    </button>
                </form>
                {isLoading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                {searchResults.length > 0 ? (
                    <div className="search-results">
                        {searchResults.map((movie) => (
                            <div key={movie.movie_id}>
                                <Link to={`/movies/${movie.movie_id}`}>{movie.title}</Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    !isLoading && searchQuery && <p className="no-results">No results found.</p>
                )}
            </div>
            <div className="navbar-links">
                <button className="menu-button" onClick={toggleMenu}>
                    <FaBars />
                    <span>MENU</span>
                </button>
                {isMenuOpen && (
                    <div className="dropdown-menu">
                        <Link to="/">HOME</Link>
                        <Link to="/Category">Category</Link>
                    </div>
                )}
                {!isLoggedIn ? (
                    <button className="navbar-icon">
                        <Link to="/login">Sign In</Link>
                    </button>
                ) : (
                    <>
                        <button className="navbar-icon">
                            <Link to="/Profile">
                                <FaUser /> Profile
                            </Link>
                        </button>
                        <button className='logout-btn' onClick={onLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
