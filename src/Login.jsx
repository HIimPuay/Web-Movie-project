import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send login request to the server
            const response = await axios.post('http://localhost:8080/api/login', {
                email,
                password,
            });

            // Extract token and user_id from response
            const { token, user_id } = response.data;

            // Save token to localStorage or cookies
            localStorage.setItem('token', token);
            localStorage.setItem('user_id', user_id);

            // Call onLogin to update the app state
            onLogin({ user_id, email });

            // Redirect to home page
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid login credentials.');
        }
    };

    const handleClose = () => {
        // Close the login modal  
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <button className="close-button" onClick={handleClose}>
                    ✖
                </button>
                <div className="login-form">
                    <h2>Sign in</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <div className="remember-me">
                            <input 
                                type="checkbox" 
                                checked={rememberMe} 
                                onChange={() => setRememberMe(!rememberMe)} 
                            />
                            <label>Remember me</label>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <p>If you don't have an account, <a href="/register">Register here!</a></p>
                    <p><a href="/forgot-password">Forgot Password?</a></p>
                </div>
                <div className="login-image">
                    <img src="" />
                </div>
            </div>
        </div>
    );
}

export default Login;
