package com.hospital.backend.service;

import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.Status;
import com.hospital.backend.entity.User;
import com.hospital.backend.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final com.hospital.backend.repository.DoctorSlotRepository doctorSlotRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Appointment bookAppointment(Appointment appointment) {
        System.out.println("Trying to book appointment on: " + appointment.getAppointmentDate() +
                " from " + appointment.getStartTime() + " to " + appointment.getEndTime() +
                " for Doctor: " + appointment.getDoctor().getId());

        // Business Rule: Prevent overlapping appointments for the same doctor
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorAndAppointmentDate(
                appointment.getDoctor(), appointment.getAppointmentDate());

        for (Appointment existing : existingAppointments) {
            System.out.println("Comparing with existing: " + existing.getStartTime() + " - " + existing.getEndTime());
            boolean overlaps = appointment.getStartTime().isBefore(existing.getEndTime()) &&
                    appointment.getEndTime().isAfter(existing.getStartTime());
            if (overlaps) {
                System.out.println("OVERLAP DETECTED!");
                throw new RuntimeException("Appointment overlaps with an existing one for this doctor.");
            }
        }

        appointment.setStatus(Status.BOOKED);
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Delete the available slot now that it's booked
        List<com.hospital.backend.entity.DoctorSlot> slotsToRemove = doctorSlotRepository
                .findByDoctorAndDateAndStartTimeAndEndTime(
                        appointment.getDoctor(),
                        appointment.getAppointmentDate(),
                        appointment.getStartTime(),
                        appointment.getEndTime());
        doctorSlotRepository.deleteAll(slotsToRemove);

        // Broadcast to clients listening to doctors availability
        messagingTemplate.convertAndSend("/topic/appointments", "BOOKED:" + savedAppointment.getId());
        messagingTemplate.convertAndSend("/topic/slots", "SLOT_UPDATED:" + appointment.getDoctor().getId());

        return savedAppointment;
    }

    public Appointment confirmAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(Status.CONFIRMED);
        Appointment saved = appointmentRepository.save(appointment);
        messagingTemplate.convertAndSend("/topic/appointments", "CONFIRMED:" + saved.getId() + ":" + appointment.getPatient().getId());
        return saved;
    }

    public Appointment cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(Status.CANCELLED);
        Appointment saved = appointmentRepository.save(appointment);
        messagingTemplate.convertAndSend("/topic/appointments", "CANCELLED:" + saved.getId() + ":" + appointment.getPatient().getId());
        messagingTemplate.convertAndSend("/topic/slots", "SLOT_UPDATED:" + appointment.getDoctor().getId());
        return saved;
    }

    public List<Appointment> getAppointmentsByDoctor(User doctor) {
        return appointmentRepository.findByDoctor(doctor);
    }

    public List<Appointment> getAppointmentsByPatient(User patient) {
        return appointmentRepository.findByPatient(patient);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}
