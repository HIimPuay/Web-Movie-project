// client/src/components/Trending.js
import React from 'react';
import './styles/Trending.css';

function Trending() {
    return (
        <div className="trending">
            <h2>Trending</h2>
            <div className="trending-main">
                <button className="nav-button left">❮</button>
                <div className="trending-thumbnail">
                    <div className="movie-title">Movie Title</div>
                    <div className="movie-description">Movie description goes here.</div>
                </div>
                <button className="nav-button right">❯</button>
            </div>
        </div>
    );
}

export default Trending;
