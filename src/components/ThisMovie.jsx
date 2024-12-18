import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./styles/ThisMovie.css";

function ThisMovie() {
    const { id } = useParams(); // ดึง id จาก URL ด้วย useParams
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]); // เก็บข้อมูลรีวิว
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");
    const [totalRating, setTotalRating] = useState(0);

    // Fetch movie and reviews data
    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                // ดึงข้อมูลหนัง
                const movieResponse = await axios.get(`http://localhost:8080/api/movies/${id}`);
                setMovie(movieResponse.data);

                // ดึงข้อมูลรีวิว
                const reviewResponse = await axios.get(`http://localhost:8080/api/movies/${id}/reviews`);
                setReviews(reviewResponse.data);
            } catch (err) {
                console.error("Error fetching data:", err.message);
            }
        };

        fetchMovieData();
    }, [id]);

    const handleAddComment = () => {
        if (!comment || selectedRating === 0) {
            alert("กรุณากรอกคอมเมนต์และเลือกคะแนน");
            return;
        }
    
        const newReview = {
            username: username || "ไม่ระบุชื่อ", // Default if username is empty
            content: comment,
            review_date: new Date().toISOString().split("T")[0], // Current date
            rating: selectedRating,
            movie_id: parseInt(id),
            user_id: 1, // Adjust user_id as needed
        };
    
        axios
            .post(`http://localhost:8080/api/movies/${id}/reviews`, newReview)
            .then((response) => {
                setReviews([...reviews, response.data]); // Update the reviews
                setPopupVisible(false);
                setUsername("");
                setComment("");
                setSelectedRating(0);
            })
            .catch((error) => {
                console.error("Error posting review:", error.message);
                alert("ไม่สามารถเพิ่มคอมเมนต์ได้. กรุณาลองใหม่");
            });
    };
    
    

    const averageRating = reviews.length
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

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
                {reviews.map((review) => (
                    <div className="comment" key={review.review_id}>
                        <h3>{review.review_name}</h3>
                        <p className="rating">คะแนน: {review.rating}/10</p>
                        <p>{review.content}</p>
                        <p className="date">{new Date(review.review_date).toLocaleDateString()}</p>
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
