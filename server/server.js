const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(cors(corsOptions));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',   // ที่อยู่ของเซิร์ฟเวอร์ MySQL (localhost)
    user: 'root',        // ชื่อผู้ใช้ MySQL
    password: '1904',        // รหัสผ่าน MySQL
    database: 'movie_review_web', // ชื่อฐานข้อมูล
    port: '3306'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL Database');
    }
});

// สร้าง route สำหรับดึงข้อมูลภาพยนตร์
app.get('/api/movies', (req, res) => {
    const query = 'SELECT * FROM movies'; // เปลี่ยนตามตารางในฐานข้อมูล
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching movies:', err.message);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

app.get('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM movies WHERE movie_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching movie:', err.message);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(results[0]);
    });
});

app.get('/api/movies/:id/reviews', async (req, res) => {
    const movieId = req.params.id;
    try {
        const [reviews] = await db.promise().query('SELECT * FROM review WHERE movie_id = ?', [movieId]);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

app.post('/api/movies/:id/reviews', async (req, res) => {
    const { username, rating, content } = req.body; // เปลี่ยนจาก comment เป็น content
    console.log("Received data:", req.body);

    if (!rating || !content) { // เปลี่ยนจาก comment เป็น content
        return res.status(400).json({ error: 'Missing required fields: rating or content' });
    }

    try {
        const reviewDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const [result] = await db.promise().query(
            'INSERT INTO review (movie_id, review_name, content, review_date, rating, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [req.params.id, username || 'Anonymous', content, reviewDate, rating, 1] // เปลี่ยนจาก comment เป็น content
        );

        const newReview = {
            review_id: result.insertId,
            movie_id: req.params.id,
            review_name: username || 'Anonymous',
            content, // เปลี่ยนจาก comment เป็น content
            review_date: reviewDate,
            rating,
            user_id: 1
        };

        res.status(201).json(newReview);
    } catch (err) {
        console.error('Error adding review:', err.message);
        res.status(500).json({ error: 'Failed to add review' });
    }
});

// server.js (หรือไฟล์ server ที่คุณใช้งาน)
app.get('/api/movies/category/:category', (req, res) => {
    const { category } = req.params;

    // กำหนด category_id ตามที่ต้องการ
    const categoryMap = {
        action: 1,
        romance: 2,
        comedy: 3,
        drama: 4,
        horror: 5
    };

    const categoryId = categoryMap[category];

    if (!categoryId) {
        return res.status(400).json({ error: "Invalid category" });
    }

    const query = `
        SELECT * FROM movies WHERE category_id = ?`;

    db.query(query, [categoryId], (err, results) => {
        if (err) {
            console.error('Error fetching movies by category:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No movies found for this category' });
        }

        res.json(results);
    });
});







const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});