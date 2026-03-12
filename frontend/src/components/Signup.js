import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const Signup = () => {
    const [user, setUser] = useState({
        name: '',
        username: '',
        password: '',
        role: 'PATIENT' // Default role for public signups
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (response.ok) {
                alert('Account created! Please login.');
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert('Error: ' + (errorData.error || 'Error creating account'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to backend');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ maxWidth: '450px', width: '100%', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Hospitalmanagement</h1>
                <p style={{ marginBottom: '2rem' }}>Join our community for better healthcare</p>
                
                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="John Doe"
                            value={user.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="johndoe123"
                            value={user.username} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="••••••••"
                            value={user.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit" style={{ marginTop: '1rem' }}>Sign Up</button>
                </form>
                
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <p>Already have an account?</p>
                    <button className="secondary" onClick={() => navigate('/login')} style={{ marginTop: '0.5rem' }}>
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
