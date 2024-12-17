import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./styles/ThisMovie.css";

function ThisMovie() {
    const { id } = useParams(); // ดึง id จาก URL
    const [movie, setMovie] = useState(null); // เก็บข้อมูลหนัง
    const [comments, setComments] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");
    const [totalRating, setTotalRating] = useState(0);

    useEffect(() => {
        // ดึงข้อมูลหนังจาก Backend ตาม id
        const fetchMovie = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/movies/${id}`);
                setMovie(response.data);
            } catch (err) {
                console.error("Error fetching movie data:", err.message);
            }
        };

        fetchMovie();
    }, [id]);

    const handleAddComment = () => {
        if (!comment || !selectedRating) {
            alert("กรุณากรอกคอมเมนต์และเลือกคะแนน");
            return;
        }

        const newComment = {
            username: username || "ไม่ระบุชื่อ",
            rating: selectedRating,
            comment: comment,
        };

        setComments([...comments, newComment]);
        setTotalRating(totalRating + selectedRating);
        setPopupVisible(false);
        setUsername("");
        setComment("");
        setSelectedRating(0);
    };

    const averageRating = comments.length ? (totalRating / comments.length).toFixed(1) : 0;

    if (!movie) return <div>Loading...</div>;

    return (
        <div className="this-movie">
            <h1>Movie Review</h1>

            {/* Movie Section */}
            <div className="movie-section">
                <div className="movie-poster">
                    <img src={movie.image} alt="Movie Poster" />
                </div>
                <div className="movie-details">
                    <h2>{movie.title}</h2>
                    <p>{movie.des}</p>
                    <p>ความยาว: {movie.lenght} นาที</p>
                    <p>คะแนนเฉลี่ย: {averageRating}/10</p>
                </div>
            </div>

            {/* Add Comments Section */}
            <div className="comments">
                <h2>ความคิดเห็น</h2>
                {comments.map((c, index) => (
                    <div className="comment" key={index}>
                        <h3>{c.username}</h3>
                        <p className="rating">คะแนน: {c.rating}/10</p>
                        <p>{c.comment}</p>
                    </div>
                ))}
            </div>

            <button className="add-comment-btn" onClick={() => setPopupVisible(true)}>
                เพิ่มคอมเมนต์
            </button>

            {/* Popup */}
            {popupVisible && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <span className="close-popup" onClick={() => setPopupVisible(false)}>
                            &times;
                        </span>
                        <h2>ให้คะแนนและเขียนคอมเมนต์</h2>

                        <div className="star-rating">
                            {[...Array(10)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`star ${i + 1 <= selectedRating ? "full" : ""}`}
                                    onClick={() => setSelectedRating(i + 1)}
                                >
                                    &#9733;
                                </span>
                            ))}
                        </div>

                        <input
                            type="text"
                            placeholder="ชื่อผู้ใช้ (เว้นว่างหากไม่ระบุชื่อ)"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <textarea
                            placeholder="เขียนรีวิวของคุณที่นี่..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <button onClick={handleAddComment}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ThisMovie;
