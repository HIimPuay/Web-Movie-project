require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // For JWT authentication

const app = express();

// Middleware
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

console.log('JWT_SECRET:', process.env.JWT_SECRET);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movie_review_web', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// MongoDB Schemas
const CategorySchema = new mongoose.Schema({
    category_name: { type: String, required: true }
});

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    score: { type: Number, required: true },
    image: { type: String, required: true },
    des: { type: String, required: true },
    length: { type: Number, required: true },
    category_name: { type: String, required: true }, // Using category_name directly
    trailerUrl: { type: String }
});

const UserSchema = new mongoose.Schema({
    user_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const ReviewSchema = new mongoose.Schema({
    review_name: { type: String, required: true },
    content: { type: String, required: true },
    review_date: { type: Date, required: true },
    rating: { type: Number, required: true },
    movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Category = mongoose.model('Category', CategorySchema);
const Movie = mongoose.model('Movie', MovieSchema);
const User = mongoose.model('User', UserSchema);
const Review = mongoose.model('Review', ReviewSchema);

// Middleware to verify the JWT token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

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
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies.' });
    }
});

// Fetch a single movie by ID
app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found.' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch the movie.' });
    }
});

// Fetch reviews for a specific movie
app.get('/api/movies/:id/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ movie_id: req.params.id }).populate('user_id');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
});

// Add a new review (Protected Route)
app.post('/api/movies/:id/reviews', authenticateToken, async (req, res) => {
    const { rating, content } = req.body;

    if (!rating || !content) {
        return res.status(400).json({ error: 'Rating and content are required.' });
    }

    try {
        const review = new Review({
            review_name: req.user.email || 'Anonymous',
            content,
            review_date: new Date(),
            rating,
            movie_id: req.params.id,
            user_id: req.user.user_id
        });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add review.' });
    }
});

// Register a new user
app.post('/api/register', async (req, res) => {
    const { user_name, email, password } = req.body;

    if (!user_name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ user_name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: 'Email already exists.' });
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
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found.' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password.' });

        const token = jwt.sign({ user_id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Fetch movies by category_name
app.get('/api/movies/category/:category_name', async (req, res) => {
    try {
        console.log("Request category_name:", req.params.category_name);

        // Perform case-insensitive search using a regular expression
        const category = await Category.findOne({
            category_name: { $regex: new RegExp('^' + req.params.category_name + '$', 'i') }  // 'i' flag for case insensitivity
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found.' });
        }

        // Fetch movies for the found category
        const movies = await Movie.find({ category_name: category.category_name });
        res.json(movies);
    } catch (err) {
        console.error("Error fetching movies by category:", err.message);
        res.status(500).json({ error: 'Failed to fetch movies by category.' });
    }
});


// Fetch all categories
app.get('/api/category', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (err) {
        console.error("Error fetching categories:", err.message);
        res.status(500).json({ error: 'Failed to fetch categories.' });
    }
});
app.delete('/api/movies/:movieId/reviews/:reviewId', authenticateToken, async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found.' });
        }

        res.json({ message: 'Review deleted successfully.' });
    } catch (err) {
        console.error("Error deleting review:", err.message);
        res.status(500).json({ error: 'Failed to delete review.' });
    }
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
