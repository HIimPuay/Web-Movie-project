import React from 'react';
import './styles/MovieCard.css';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function MovieCard({ movie_id, title, score, image }){

    return (
            <div className="movie-card">
                <div className="movie-thumbnail">
                    <img src={image} alt={title} />
                </div>
                <div className="movie-info">
                    <div className="movie-score">⭐ {score}</div>
                    <h4 className="movie-title">{title}</h4>
                </div>
            </div>
    );
}

export default MovieCard;
