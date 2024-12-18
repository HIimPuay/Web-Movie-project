import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import MovieCard from './MovieCard';
import './styles/Toprate.css';
import { Link } from "react-router-dom";

function Toprate() {
    const [movies, setMovies] = useState([]); // สร้าง state สำหรับเก็บข้อมูลภาพยนตร์
    const comedyRef = useRef(null);

    // ฟังก์ชัน fetch ข้อมูลจาก backend
    const fetchMovies = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/movies"); // URL backend
    
            // เรียงข้อมูลตามคะแนนจากมากไปน้อย
            const sortedMovies = response.data.sort((a, b) => b.score - a.score);
    
            setMovies(sortedMovies); // เซ็ตข้อมูลที่เรียงแล้ว
        } catch (err) {
            console.error("Error fetching movies:", err.message);
        }
    };

    useEffect(() => {
        fetchMovies(); // ดึงข้อมูลเมื่อคอมโพเนนต์ถูก render
    }, []);

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
        <div className="Toprate">
            <h2>Top rate</h2>
            <div className="Top-movies">
                <button className="nav-button left" onClick={() => moveCarousel("left", comedyRef)}>❮</button>
                <div className="movie-cards" ref={comedyRef}>
                    {movies.map((movie, index) => (
                        <Link to={`/movies/${movie.movie_id}`}>
                        <MovieCard 
                            key={index} 
                            title={movie.title} 
                            score={movie.score} 
                            image={movie.image} 
                        />
                        </Link>
                    ))}
                </div>
                <button className="nav-button right" onClick={() => moveCarousel("right", comedyRef)}>❯</button>
            </div>
        </div>
    );
}

export default Toprate;
