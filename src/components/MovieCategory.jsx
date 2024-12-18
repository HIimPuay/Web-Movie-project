import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./styles/Category.css";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";

function MovieCategory({ category }) {
    const [moviesByCategory, setMoviesByCategory] = useState([]);
    const categoryRef = useRef(null);

    useEffect(() => {
        const fetchMoviesByCategory = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/movies/category/${category}`);
                setMoviesByCategory(response.data);
            } catch (error) {
                console.error("Error fetching movie categories", error);
            }
        };
        fetchMoviesByCategory();
    }, [category]);

    const moveCarousel = (direction, ref) => {
        const carousel = ref.current;
        const scrollAmount = 300; // ระยะการเลื่อน
        if (direction === "left") {
            carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
            carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="category">
            <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Movies</h1>

            {/* Movie Section */}
            <div className="category-movies">
                <button className="nav-button left" onClick={() => moveCarousel("left", categoryRef)}>❮</button>
                <div className="movie-cards" ref={categoryRef}>
                    {moviesByCategory.map((movie, index) => (
                        <Link to={`/movies/${movie.movie_id}`}>
                        <MovieCard key={index} title={movie.title} score={movie.score} image={movie.image} />
                        </Link>
                    ))}
                </div>
                <button className="nav-button right" onClick={() => moveCarousel("right", categoryRef)}>❯</button>
            </div>
        </div>
    );
}

export default MovieCategory;
