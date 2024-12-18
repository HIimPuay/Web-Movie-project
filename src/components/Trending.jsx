// client/src/components/Trending.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // หรือใช้ fetch หากไม่ต้องการใช้ axios
import './styles/Trending.css';

function Trending() {
    const [movies, setMovies] = useState([]); // สำหรับเก็บข้อมูลหนัง
    const [currentIndex, setCurrentIndex] = useState(0); // สำหรับการเลื่อนหนัง

    // ดึงข้อมูลหนังจาก API เมื่อคอมโพเนนต์ถูกเรนเดอร์
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/movies'); // หรือ URL ของ API ที่คุณต้องการ
                setMovies(response.data); // เก็บข้อมูลหนัง
            } catch (err) {
                console.error('Error fetching movies:', err.message);
            }
        };
        fetchMovies();
    }, []);

    // ฟังก์ชั่นสำหรับการเลื่อนหนังไปทางซ้าย
    const goLeft = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? movies.length - 1 : prevIndex - 1));
    };

    // ฟังก์ชั่นสำหรับการเลื่อนหนังไปทางขวา
    const goRight = () => {
        setCurrentIndex((prevIndex) => (prevIndex === movies.length - 1 ? 0 : prevIndex + 1));
    };

    // ตรวจสอบว่า movies มีข้อมูลหรือไม่
    if (movies.length === 0) return <div>Loading...</div>;

    const currentMovie = movies[currentIndex]; // เลือกหนังที่จะแสดงตาม currentIndex

    return (
        <div className="trending">
            <h2>Trending</h2>
            <div className="trending-main">
                <button className="nav-button left" onClick={goLeft}>❮</button>
                <div className="trending-thumbnail">
                    <img src={currentMovie.image} alt={currentMovie.title} /> {/* แสดงภาพหนัง */}
                </div>
                <button className="nav-button right" onClick={goRight}>❯</button>
                <div className='movie-info'>
                    <div className="movie-title">{currentMovie.title}</div>
                    <div className="movie-description">{currentMovie.des}</div> {/* แสดงคำบรรยาย */}
                </div>
            </div>
        </div>
    );
}

export default Trending;

