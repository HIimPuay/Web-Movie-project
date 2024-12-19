import React, { useState, useEffect } from 'react';
import './styles/UserProfile.css';
import axios from 'axios';


function UserProfile({ onLogout }) {
    const [user, setUser] = useState(null); // State to store user data
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        // Fetch user details
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from localStorage

                if (!token) {
                    setError('User not logged in');
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch (err) {
                console.error('Error fetching user data:', err.message);
                setError('Failed to fetch user details.');
            }
        };

        fetchUserData();
    }, []);

    if (error) {
        return <div className="UserProfile-error">{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="UserProfile">
            <div className="userimg-item">
                <img src={user.image || '/default-user.png'} alt="User" className="user-img" />
            </div>
            <div className="UserProfile-thumbnail">
                <h1>{user.name}</h1>
                <h4>Email: {user.email}</h4>
            </div>
        </div>
    );
}

export default UserProfile;