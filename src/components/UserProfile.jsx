import React, { useState, useEffect } from 'react';
import './styles/UserProfile.css';
import axios from 'axios';

function UserProfile({ onLogout }) {
    const [user, setUser] = useState(null); // State to store user data
    const [error, setError] = useState(null); // State to handle errors
    const [editing, setEditing] = useState(false); // State to toggle editing mode
    const [newUsername, setNewUsername] = useState(''); // State for new username

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token:', token); // Log the token for debugging

                if (!token) {
                    setError('User not logged in');
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('User data response:', response.data); // Log the response
                setUser(response.data);
                setNewUsername(response.data.user_name); // Set initial username
            } catch (err) {
                console.error('Error fetching user data:', err);
                if (err.response) {
                    setError(`Error ${err.response.status}: ${err.response.data.error}`);
                } else {
                    setError('Failed to fetch user details.');
                }
            }
        };

        fetchUserData();
    }, []);

    const handleEditUsername = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User not logged in');
                return;
            }

            const response = await axios.put(
                'http://localhost:8080/api/user/profile',
                { user_name: newUsername },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Username updated:', response.data);
            setUser({ ...user, user_name: newUsername }); // Update local state
            setEditing(false); // Exit editing mode
        } catch (err) {
            console.error('Error updating username:', err);
            if (err.response) {
                setError(`Error ${err.response.status}: ${err.response.data.error}`);
            } else {
                setError('Failed to update username.');
            }
        }
    };

    if (error) {
        return <div className="UserProfile-error">{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="UserProfile">
            <div className="userimg-item">
                <img src="https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg" />
                {/* <img src={user.image || '/default-user.png'} alt="User" className="user-img" /> */}
            </div>
            <div className="UserProfile-thumbnail">
                <h1>
                    {editing ? (
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                    ) : (
                        user.user_name || 'Anonymous'
                    )}
                </h1>
                <h4>Email: {user.email}</h4>
            </div>
            {editing ? (
                <div className="UserProfile-actions">
                    <button onClick={handleEditUsername}>Save</button>
                    <button onClick={() => setEditing(false)}>Cancel</button>
                </div>
            ) : (
                <button onClick={() => setEditing(true)}>Edit Username</button>
            )}
        </div>
    );
}

export default UserProfile;
