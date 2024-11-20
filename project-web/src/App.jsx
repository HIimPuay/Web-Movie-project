// App.jsx
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="navbar">
        <div className="navbar-logo">
          <img src="path/to/logo.png" alt="Logo" />
          <span>MENU</span>
        </div>
        <div className="navbar-menu">
          <a href="/playlist">Playlist</a>
          <a href="/profile">Profile</a>
        </div>
      </header>

      <section className="trending-section">
        <h2 className="trending-title">Trending</h2>
        <div className="trending-carousel">
          <div className="trending-card">Trending Movie 1</div>
          <div className="trending-arrow">▶</div>
        </div>
      </section>

      <section className="in-theater-section">
        <h2 className="in-theater-title">In Theater</h2>
        <div className="in-theater-cards">
          <div className="theater-card">
            <h4>Title 1</h4>
            <p className="score">Score: 8.5</p>
            <button className="add-button">+</button>
          </div>
          {/* เพิ่มการ์ดเพิ่มเติมตามต้องการ */}
        </div>
      </section>
    </div>
  );
}

export default App;
