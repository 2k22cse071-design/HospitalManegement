import React, { useState } from 'react';
import API_BASE_URL from '../config';
import api from '../api';

import ProtectedRoute from './ProtectedRoute';

const DoctorSlot = ({ user, onSlotAdded }) => {
    const isDoctor = user?.role === 'DOCTOR';

    const [slot, setSlot] = useState({
        doctorId: isDoctor ? user.id : '',
        date: '',
        startTime: '',
        endTime: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSlot({ ...slot, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const slotData = {
                ...slot,
                doctorId: isDoctor ? user.id : slot.doctorId
            };

            const response = await api.post(`/slots`, slotData);
            if (response.ok) {
                alert('Slot added successfully!');
                setSlot({
                    doctorId: isDoctor ? user.id : '',
                    date: '',
                    startTime: '',
                    endTime: ''
                });
                if (onSlotAdded) onSlotAdded();
            } else {
                alert('Error adding slot');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to backend');
        }
    };

    return (
        <ProtectedRoute>
            <div className="card">
                <h2>{isDoctor ? 'Add My Availability' : 'Add Doctor Slot'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isDoctor && (
                        <div className="form-group">
                            <label>Doctor ID</label>
                            <input type="number" name="doctorId" value={slot.doctorId} onChange={handleChange} required />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Date</label>
                        <input type="date" name="date" value={slot.date} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Start Time</label>
                        <input type="time" name="startTime" value={slot.startTime} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>End Time</label>
                        <input type="time" name="endTime" value={slot.endTime} onChange={handleChange} required />
                    </div>
                    <button type="submit">Add Slot</button>
                </form>
            </div>
        </ProtectedRoute>
    );
};

export default DoctorSlot;
