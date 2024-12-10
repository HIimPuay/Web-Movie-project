// client/src/components/MovieCard.js
import React from 'react';
import './styles/MovieCard.css';

function MovieCard({ title, score }) {
    return (
        <div className="movie-card">
            <div className="movie-thumbnail">
                <img src="#" alt="" />
                <button className="add-button">+</button>
            </div>
            <div className="movie-info">
                <div className="movie-score">⭐ {score}</div>
                <h4 className="movie-title">{title}</h4>
                <button className="playlist-button">+ playlist</button>
            </div>
        </div>
    );
}

export default MovieCard;
