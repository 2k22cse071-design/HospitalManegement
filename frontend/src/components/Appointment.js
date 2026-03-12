import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import API_BASE_URL from '../config';

import ProtectedRoute from './ProtectedRoute';

const Appointment = ({ onAppointmentBooked }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [doctors, setDoctors] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');

    const [appointment, setAppointment] = useState({
        patientId: user?.role === 'PATIENT' ? user.id : '',
        doctorId: '',
        appointmentDate: '',
        startTime: '',
        endTime: ''
    });

    const selectedDoctorIdRef = useRef(selectedDoctorId);

    useEffect(() => {
        selectedDoctorIdRef.current = selectedDoctorId;
    }, [selectedDoctorId]);

    useEffect(() => {
        fetchDoctors();

        // Establish WebSocket Connection
        const stompClient = new Client({
            webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws-hospital`),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket for Appointment Updates');
                // Listen for slot updates for currently viewed doctor
                stompClient.subscribe('/topic/slots', (message) => {
                    const payload = message.body; // e.g. "SLOT_UPDATED:2"
                    if (payload.startsWith('SLOT_UPDATED:')) {
                        const updatedDoctorId = payload.split(':')[1];
                        if (selectedDoctorIdRef.current === updatedDoctorId) {
                            console.log('Slot was booked in real-time, fetching fresh slots...');
                            fetchSlots(updatedDoctorId);
                        }
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker error', frame.headers['message']);
            }
        });
        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/users/doctors`);
            if (res.ok) setDoctors(await res.json());
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchSlots = async (doctorId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/slots/doctor/${doctorId}`);
            if (res.ok) setAvailableSlots(await res.json());
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };

    const handleDoctorChange = (e) => {
        const docId = e.target.value;
        setSelectedDoctorId(docId);
        setAppointment({ ...appointment, doctorId: docId, appointmentDate: '', startTime: '', endTime: '' });
        if (docId) {
            fetchSlots(docId);
        } else {
            setAvailableSlots([]);
        }
    };

    const handleSlotChange = (e) => {
        const slotId = e.target.value;
        const selectedSlot = availableSlots.find(s => s.id.toString() === slotId);
        if (selectedSlot) {
            setAppointment({
                ...appointment,
                appointmentDate: selectedSlot.date,
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!appointment.startTime) {
            alert('Please select an available slot');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointment),
            });
            if (response.ok) {
                alert('Appointment booked successfully!');
                setAppointment({
                    patientId: user?.role === 'PATIENT' ? user.id : '',
                    doctorId: '',
                    appointmentDate: '',
                    startTime: '',
                    endTime: ''
                });
                setSelectedDoctorId('');
                setAvailableSlots([]);
                if (onAppointmentBooked) onAppointmentBooked();
            } else {
                try {
                    const errorData = await response.json();
                    alert('Error: ' + (errorData.error || 'Error booking appointment'));
                } catch (e) {
                    alert('Error booking appointment (Status: ' + response.status + ')');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to backend');
        }
    };

    return (
        <ProtectedRoute>
            <div className="card">
                <h2>Book Appointment</h2>
                <form onSubmit={handleSubmit}>
                    {user?.role !== 'PATIENT' && (
                        <div className="form-group">
                            <label>Patient ID</label>
                            <input type="number" name="patientId" value={appointment.patientId} readOnly required />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Select Doctor</label>
                        <select value={selectedDoctorId} onChange={handleDoctorChange} required>
                            <option value="">-- Choose a Doctor --</option>
                            {doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name} ({doc.specialization})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedDoctorId && (
                        <div className="form-group">
                            <label>Available Slots</label>
                            <select onChange={handleSlotChange} required>
                                <option value="">-- Choose a Timing --</option>
                                {availableSlots.length > 0 ? (
                                    availableSlots.map(slot => (
                                        <option key={slot.id} value={slot.id}>
                                            {slot.date} | {slot.startTime} - {slot.endTime}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No slots available</option>
                                )}
                            </select>
                        </div>
                    )}

                    <button type="submit" disabled={!appointment.startTime}>
                        Confirm Booking
                    </button>
                </form>
            </div>
        </ProtectedRoute>
    );
};

export default Appointment;
