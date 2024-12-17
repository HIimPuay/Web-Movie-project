import React from 'react';
import './styles/MovieCard.css';
import { Link } from "react-router-dom";

function MovieCard({ id, title, score, image }) {
    return (
        <Link to={`/movie/${id}`}>
            <div className="movie-card">
                <div className="movie-thumbnail">
                    <img src={image} alt={title} />
                </div>
                <div className="movie-info">
                    <div className="movie-score">⭐ {score}</div>
                    <h4 className="movie-title">{title}</h4>
                </div>
            </div>
        </Link>
    );
}

export default MovieCard;
