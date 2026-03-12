package com.hospital.backend.controller;

import com.hospital.backend.dto.AppointmentRequest;
import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.User;
import com.hospital.backend.service.AppointmentService;
import com.hospital.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = {"https://hospital-management-*.vercel.app", "http://localhost:3000"})
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Appointment> bookAppointment(@RequestBody AppointmentRequest request) {
        User patient = userService.getUserById(request.getPatientId());
        User doctor = userService.getUserById(request.getDoctorId());

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getAppointmentDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        return ResponseEntity.ok(appointmentService.bookAppointment(appointment));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Appointment> confirmAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        User doctor = userService.getUserById(doctorId);
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctor));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable Long patientId) {
        User patient = userService.getUserById(patientId);
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patient));
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }
}
