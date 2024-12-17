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






// Mongodb
const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/movie_review_web';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err.message));


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});