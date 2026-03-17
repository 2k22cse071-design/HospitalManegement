import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                alert(`Login successful! Welcome ${data.user.name}`);
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                alert('Error: ' + (errorData.error || 'Invalid username or password'));
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
                <p style={{ marginBottom: '2rem' }}>Sign in to manage your appointments</p>
                
                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="Enter your username"
                            value={credentials.username} 
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
                            value={credentials.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit" style={{ marginTop: '1rem' }}>Login</button>
                </form>
                
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <p>Don't have an account?</p>
                    <button className="secondary" onClick={() => navigate('/signup')} style={{ marginTop: '0.5rem' }}>
                        Create an Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
