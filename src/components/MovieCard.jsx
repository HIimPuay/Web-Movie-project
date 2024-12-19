import React from 'react';
import './styles/MovieCard.css';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function MovieCard({ movie_id, title, score, image }){
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch reviews for the movie
        async function fetchReviews() {
            try {
                const response = await fetch(`http://localhost:8080/api/movies/${movie_id}/reviews`);
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, [movie_id]);

    const averageRating = reviews.length
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : score;

    if (loading) return <div>Loading...</div>;

    return (
            <div className="movie-card">
                <div className="movie-thumbnail">
                    <img src={image} alt={title} />
                </div>
                <div className="movie-info">
                    <div className="movie-score">⭐ {averageRating}</div>
                    <h4 className="movie-title">{title}</h4>
                </div>
            </div>
    );
}

export default MovieCard;
