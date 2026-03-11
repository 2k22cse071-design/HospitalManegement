package com.hospital.backend.config;

import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.repository.DoctorSlotRepository;
import com.hospital.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class CheckDB implements CommandLineRunner {
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorSlotRepository doctorSlotRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("📊 ACTUAL DATABASE TABLES STATUS");
        System.out.println("=".repeat(60));

        System.out.println("\n[TABLE: USERS]");
        System.out.printf("%-5s | %-15s | %-15s | %-10s | %-15s\n", "ID", "USERNAME", "NAME", "ROLE", "SPECIALTY");
        System.out.println("-".repeat(70));
        userRepository.findAll().forEach(u -> 
            System.out.printf("%-5d | %-15s | %-15s | %-10s | %-15s\n", 
                u.getId(), u.getUsername(), u.getName(), u.getRole(), u.getSpecialization() != null ? u.getSpecialization() : "N/A")
        );

        System.out.println("\n[TABLE: APPOINTMENTS]");
        System.out.printf("%-5s | %-15s | %-15s | %-12s | %-15s | %-10s\n", "ID", "PATIENT", "DOCTOR", "DATE", "TIME", "STATUS");
        System.out.println("-".repeat(85));
        appointmentRepository.findAll().forEach(a -> 
            System.out.printf("%-5d | %-15s | %-15s | %-12s | %-15s | %-10s\n", 
                a.getId(), a.getPatient().getName(), a.getDoctor().getName(), a.getAppointmentDate(), 
                a.getStartTime() + " - " + a.getEndTime(), a.getStatus())
        );

        System.out.println("\n[TABLE: DOCTOR_SLOTS]");
        System.out.printf("%-5s | %-15s | %-12s | %-15s\n", "ID", "DOCTOR", "DATE", "TIME");
        System.out.println("-".repeat(55));
        doctorSlotRepository.findAll().forEach(s -> 
            System.out.printf("%-5d | %-15s | %-12s | %-15s\n", 
                s.getId(), s.getDoctor().getName(), s.getDate(), s.getStartTime() + " - " + s.getEndTime())
        );

        System.out.println("\n" + "=".repeat(60));
    }
}
