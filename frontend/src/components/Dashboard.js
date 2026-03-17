import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import API_BASE_URL from '../config';
import api from '../api';
import ProtectedRoute from './ProtectedRoute';
import CreateUser from './CreateUser';
import DoctorSlot from './DoctorSlot';
import Appointment from './Appointment';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);

    const userRef = useRef(user);

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchData(storedUser);
        }

        const stompClient = new Client({
            webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws-hospital`),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Dashboard Connected to WebSocket');
                stompClient.subscribe('/topic/appointments', (message) => {
                    const payload = message.body; 
                    const parts = payload.split(':');
                    const eventType = parts[0];
                    const appointmentId = parts[1];
                    const patientId = parts[2]; // Might be undefined if not confirmed/cancelled

                    const currentUser = userRef.current;
                    if (!currentUser) return;

                    if (eventType === 'BOOKED' && (currentUser.role === 'ADMIN' || currentUser.role === 'DOCTOR')) {
                        console.log('New appointment booked, refreshing data...');
                        fetchData(currentUser);
                    }

                    if ((eventType === 'CONFIRMED' || eventType === 'CANCELLED') && currentUser.role === 'PATIENT' && parseInt(patientId) === currentUser.id) {
                        alert(`Real-Time Update: Your appointment status has been updated to ${eventType}!`);
                        fetchData(currentUser);
                    }
                    
                    if ((eventType === 'CONFIRMED' || eventType === 'CANCELLED') && (currentUser.role === 'ADMIN' || currentUser.role === 'DOCTOR')) {
                        fetchData(currentUser);
                    }
                });
            }
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [navigate]);

    const fetchData = async (currentUser) => {
        try {
            if (currentUser.role === 'ADMIN') {
                const res = await api.get(`/appointments`);
                if (res.ok) setAppointments(await res.json());
            } else if (currentUser.role === 'DOCTOR') {
                const appRes = await api.get(`/appointments/doctor/${currentUser.id}`);
                if (appRes.ok) setAppointments(await appRes.json());

                const slotRes = await api.get(`/slots/doctor/${currentUser.id}`);
                if (slotRes.ok) setSlots(await slotRes.json());
            } else if (currentUser.role === 'PATIENT') {
                const res = await api.get(`/appointments/patient/${currentUser.id}`);
                if (res.ok) setAppointments(await res.json());
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleStatusChange = async (id, status) => {
        const endpoint = status === 'CONFIRMED' ? 'confirm' : 'cancel';
        try {
            const res = await api.put(`/appointments/${id}/${endpoint}`);
            if (res.ok) {
                alert(`Appointment ${status.toLowerCase()}ed successfully`);
                fetchData(user);
            }
        } catch (error) {
            alert('Error updating status');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!user) return <div className="container">Loading...</div>;

    return (
        <ProtectedRoute>
            <div className="container">
                <header className="top-bar">
                    <div className="welcome-section">
                        <h1>Hospitalmanagement</h1>
                        <p>Hello, <strong>{user.name}</strong> <span className={`badge ${user.role.toLowerCase()}`}>{user.role}</span></p>
                    </div>
                    <button onClick={handleLogout} className="danger">
                        Logout
                    </button>
                </header>

                <main>
                    {/* ADMIN VIEW: ONLY create users and see appointments */}
                    {user.role === 'ADMIN' && (
                        <div id="admin-section">
                            <CreateUser />
                            <div className="card">
                                <h2>System Appointments (Admin)</h2>
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Patient</th>
                                                <th>Doctor</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {appointments.map(app => (
                                            <tr key={app.id}>
                                                <td>{app.patient.name}</td>
                                                <td>{app.doctor.name}</td>
                                                <td>{app.appointmentDate}</td>
                                                <td>{app.startTime} - {app.endTime}</td>
                                                <td><span className={`status-${app.status.toLowerCase()}`}>{app.status === 'BOOKED' ? 'PENDING' : app.status}</span></td>
                                                <td>
                                                    {app.status === 'BOOKED' && (
                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                            <button onClick={() => handleStatusChange(app.id, 'CONFIRMED')} style={{ padding: '5px 10px', fontSize: '10px', backgroundColor: '#22c55e' }}>Confirm</button>
                                                            <button onClick={() => handleStatusChange(app.id, 'CANCELLED')} style={{ padding: '5px 10px', fontSize: '10px', backgroundColor: '#ef4444' }}>Cancel</button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    {appointments.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No appointments found.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DOCTOR VIEW: ONLY manage slots and see their appointments */}
                    {user.role === 'DOCTOR' && (
                        <div id="doctor-section">
                            <div className="card">
                                <h2>My Appointments</h2>
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Patient</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map(app => (
                                                <tr key={app.id}>
                                                    <td>{app.patient.name}</td>
                                                    <td>{app.appointmentDate}</td>
                                                    <td>{app.startTime} - {app.endTime}</td>
                                                    <td><span className={`status-${app.status.toLowerCase()}`}>{app.status === 'BOOKED' ? 'PENDING' : app.status}</span></td>
                                                    <td>
                                                        {app.status === 'BOOKED' && (
                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                <button onClick={() => handleStatusChange(app.id, 'CONFIRMED')} style={{ padding: '5px 10px', fontSize: '10px', backgroundColor: '#22c55e' }}>Confirm</button>
                                                                <button onClick={() => handleStatusChange(app.id, 'CANCELLED')} style={{ padding: '5px 10px', fontSize: '10px', backgroundColor: '#ef4444' }}>Reject</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {appointments.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No appointments scheduled.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <DoctorSlot user={user} onSlotAdded={() => fetchData(user)} />
                            <div className="card">
                                <h2>My Availability Slots</h2>
                                <ul>
                                    {slots.map(slot => (
                                        <li key={slot.id}>{slot.date}: {slot.startTime} - {slot.endTime}</li>
                                    ))}
                                    {slots.length === 0 && <li>No slots added yet.</li>}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* PATIENT VIEW: ONLY book appointments and see status */}
                    {user.role === 'PATIENT' && (
                        <div id="patient-section">
                            <Appointment onAppointmentBooked={() => fetchData(user)} />
                            <div className="card">
                                <h2>My Bookings</h2>
                                <ul>
                                    {appointments.map(app => (
                                        <li key={app.id} style={{ marginBottom: '10px' }}>
                                            <strong>{app.appointmentDate}</strong> with Dr. {app.doctor.name}
                                            <br />
                                            <small>{app.startTime} - {app.endTime}</small>
                                            <span className={`badge status-${app.status.toLowerCase()}`} style={{ marginLeft: '10px' }}>{app.status === 'BOOKED' ? 'PENDING' : app.status}</span>
                                        </li>
                                    ))}
                                    {appointments.length === 0 && <li>No appointments booked.</li>}
                                </ul>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default Dashboard;
