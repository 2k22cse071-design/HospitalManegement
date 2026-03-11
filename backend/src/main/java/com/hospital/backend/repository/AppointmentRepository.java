package com.hospital.backend.repository;

import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.Status;
import com.hospital.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientAndStatus(User patient, Status status);

    List<Appointment> findByDoctorAndAppointmentDate(User doctor, LocalDate date);

    List<Appointment> findByDoctor(User doctor);

    List<Appointment> findByPatient(User patient);
}
