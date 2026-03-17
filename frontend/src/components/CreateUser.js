import React, { useState } from 'react';
import API_BASE_URL from '../config';
import ProtectedRoute from './ProtectedRoute';

const CreateUser = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'PATIENT',
        specialization: ''
    });

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
                alert('User created successfully!');
                setUser({ name: '', email: '', username: '', password: '', role: 'PATIENT', specialization: '' });
            } else {
                alert('Error creating user');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to backend');
        }
    };

    return (
        <ProtectedRoute>
            <div className="card">
                <h2>Create New User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={user.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={user.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" value={user.username} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={user.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select name="role" value={user.role} onChange={handleChange}>
                            <option value="ADMIN">ADMIN</option>
                            <option value="DOCTOR">DOCTOR</option>
                            <option value="PATIENT">PATIENT</option>
                        </select>
                    </div>
                    {user.role === 'DOCTOR' && (
                        <div className="form-group">
                            <label>Specialization</label>
                            <input type="text" name="specialization" value={user.specialization} onChange={handleChange} required />
                        </div>
                    )}
                    <button type="submit">Create User</button>
                </form>
            </div>
        </ProtectedRoute>
    );
};

export default CreateUser;
