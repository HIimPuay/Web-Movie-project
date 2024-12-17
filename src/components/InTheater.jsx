// client/src/components/InTheater.js
import React, { useEffect, useRef, useState }  from 'react';
import MovieCard from './MovieCard';
import axios from "axios";
import './styles/InTheater.css';

function InTheater() {
    const [movies, setMovies] = useState([]); // สร้าง state สำหรับเก็บข้อมูลภาพยนตร์
    const comedyRef = useRef(null);

    // ฟังก์ชัน fetch ข้อมูลจาก backend
    const fetchMovies = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/movies"); // URL backend
    
            // เรียงข้อมูลตามคะแนนจากมากไปน้อย
            const sortedMovies = response.data.sort((a, b) => b.movie_id - a.movie_id);
    
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
        <div className="in-theater">
            <h2>In Theater</h2>
            <div className="theater-movies">
                <button className="nav-button left">❮</button>
                <div className="movie-cards" ref={comedyRef}>
                    {movies.map((movie, index) => (
                        <MovieCard 
                            key={index} 
                            title={movie.title} 
                            score={movie.score} 
                            image={movie.image} 
                        />
                    ))}
                </div>
                <button className="nav-button right">❯</button>
            </div>
        </div>
    );
}

export default InTheater;
