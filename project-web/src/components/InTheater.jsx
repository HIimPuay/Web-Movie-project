// client/src/components/InTheater.js
import React from 'react';
import MovieCard from './MovieCard';
import './styles/InTheater.css';

function InTheater() {
    const movies = [
        { title: 'Movie 1', score: 8.5 },
        { title: 'Movie 2', score: 7.8 },
        { title: 'Movie 3', score: 9.1 },
        { title: 'Movie 4', score: 6.3 },
    ];

    return (
        <div className="in-theater">
            <h2>In Theater</h2>
            <div className="theater-movies">
                <button className="nav-button left">❮</button>
                <div className="movie-cards">
                    {movies.map((movie, index) => (
                        <MovieCard key={index} title={movie.title} score={movie.score} />
                    ))}
                </div>
                <button className="nav-button right">❯</button>
            </div>
        </div>
    );
}

export default InTheater;
