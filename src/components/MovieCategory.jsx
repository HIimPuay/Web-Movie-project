import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./styles/Category.css";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";

function MovieCategory({ category }) {
    const [moviesByCategory, setMoviesByCategory] = useState([]);
    const [error, setError] = useState(null); // For error handling
    const categoryRef = useRef(null);

    useEffect(() => {
        const fetchMoviesByCategory = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/movies/category/${category}`);
                console.log("Filtered movies:", response.data);
                setMoviesByCategory(response.data);
            } catch (error) {
                console.error("Error fetching movie categories", error);
                setError("Failed to load movies. Please try again later.");
            }
        };
        fetchMoviesByCategory();
    }, [category]); // Fetch again when category changes

    const moveCarousel = (direction, ref) => {
        const carousel = ref.current;
        const scrollAmount = 300; // Scroll distance in pixels
        if (direction === "left") {
            carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
            carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="category">
            <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Movies</h1>

            {/* Error handling message */}
            {error && <p className="error-message">{error}</p>}

            {/* Movie Section */}
            <div className="category-movies">
                <button className="nav-button left" onClick={() => moveCarousel("left", categoryRef)}>❮</button>
                <div className="movie-cards" ref={categoryRef}>
                    {moviesByCategory.length > 0 ? (
                        moviesByCategory.map((movie) => (
                            <Link to={`/movies/${movie._id}`} key={movie._id}>
                                <MovieCard title={movie.title} score={movie.score} image={movie.image} />
                            </Link>
                        ))
                    ) : (
                        <p>No movies found for this category.</p> // Message for empty categories
                    )}
                </div>
                <button className="nav-button right" onClick={() => moveCarousel("right", categoryRef)}>❯</button>
            </div>
        </div>
    );
}

export default MovieCategory;
