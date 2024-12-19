// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

function Login({ onLogin }) {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/register', {
                user_name: userName,
                email,
                password,
            });
            setSuccess(response.data.message);
            setError('');
            navigate('/login'); // Redirect to login page after success
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleClose = () => {
        // Close the login modal
        
        navigate('/');
    };
    return (
        <div className="login-container">
            <div className="login-box">
                <div className="close-button" onClick={handleClose}>
                    ✖
                </div>
                <div className="login-form">
                    <h2>Sign up</h2>
                    <p>If you already have an account register You Can <a href="/Login">Login here!</a></p>
                    <form onSubmit={handleSubmit}>
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <label>User name</label>
                        <input 
                            type="text" 
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)} 
                            required 
                        />
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <label>Comfirm password</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                        <button type="submit">Register</button>
                    </form>
                </div>
                <div className="login-image">
                    <img src="" />
                </div>
            </div>
        </div>
    );
}

export default Login;
