require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // For JWT authentication

const app = express();

// Middleware
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1904',
    database: process.env.DB_NAME || 'movie_review_web',
    port: process.env.DB_PORT || '3306'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL Database');
    }
});

// Middleware to verify the JWT token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }
        req.user = user;
        next();
    });
}

// Routes
// Fetch all movies
app.get('/api/movies', (req, res) => {
    db.query('SELECT * FROM movies', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });
        res.json(results);
    });
});

// Fetch a single movie by ID
app.get('/api/movies/:id', (req, res) => {
    db.query('SELECT * FROM movies WHERE movie_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });
        if (!results.length) return res.status(404).json({ error: 'Movie not found' });
        res.json(results[0]);
    });
});

// Fetch reviews for a specific movie
app.get('/api/movies/:id/reviews', async (req, res) => {
    try {
        const [reviews] = await db.promise().query('SELECT * FROM review WHERE movie_id = ?', [req.params.id]);
        res.json(reviews);
    } catch (err) {
        console.error('Error fetching reviews:', err.message);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Add a new review (Protected Route)
app.post('/api/movies/:id/reviews', authenticateToken, async (req, res) => {
    const { rating, content } = req.body;

    if (!rating || !content) {
        return res.status(400).json({ error: 'Rating and content are required.' });
    }

    try {
        const reviewDate = new Date().toISOString().split('T')[0];
        const user_id = req.user.user_id; // Use the user_id from the JWT token

        const [result] = await db.promise().query(
            'INSERT INTO review (movie_id, review_name, content, review_date, rating, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [req.params.id, req.user.email || 'Anonymous', content, reviewDate, rating, user_id]
        );

        res.status(201).json({
            review_id: result.insertId,
            movie_id: req.params.id,
            review_name: req.user.email || 'Anonymous',
            content,
            review_date: reviewDate,
            rating,
            user_id
        });
    } catch (err) {
        console.error('Error adding review:', err.message);
        res.status(500).json({ error: 'Failed to add review' });
    }
});

// Fetch movies by category
app.get('/api/movies/category/:category', (req, res) => {
    const categoryMap = { action: 1, romance: 2, comedy: 3, drama: 4, horror: 5 };
    const categoryId = categoryMap[req.params.category];

    if (!categoryId) return res.status(400).json({ error: 'Invalid category' });

    db.query('SELECT * FROM movies WHERE category_id = ?', [categoryId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        if (!results.length) return res.status(404).json({ error: 'No movies found for this category' });
        res.json(results);
    });
});

// Register a new user
app.post('/api/register', async (req, res) => {
    const { user_name, email, password } = req.body;

    if (!user_name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)',
            [user_name, email, hashedPassword],
            (err, results) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists.' });
                    return res.status(500).json({ error: 'Database error.' });
                }
                res.status(201).json({ message: 'User registered successfully.' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // Fetch user from the database
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found.' });
            }

            const user = results[0];

            // Compare password with the hashed password stored in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid password.' });
            }

            // Ensure JWT_SECRET is set correctly in environment variables
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ error: 'JWT secret is not defined in the environment variables.' });
            }

            // Generate a JWT token
            const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: '1h' // Set the expiration time as required
            });

            res.json({ message: 'Login successful', token });
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
