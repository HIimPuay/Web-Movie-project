// client/src/components/InTheater.js
import React from 'react';
import MovieCard from './MovieCard';
import './styles/Toprate.css';

function Toprate() {

    return (
        <div className="Toprate">
            <h2>Top rate</h2>
            <div className="Top-movies">
                <button className="nav-button left">❮</button>
                <div className="movie-cards">
                    <MovieCard />
                    <MovieCard />
                    <MovieCard />
                    <MovieCard />
                    <MovieCard />
                    <MovieCard />
                </div>
                <button className="nav-button right">❯</button>
            </div>
        </div>
    );
}

export default Toprate;
