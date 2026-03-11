package com.hospital.backend.repository;

import com.hospital.backend.entity.DoctorSlot;
import com.hospital.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorSlotRepository extends JpaRepository<DoctorSlot, Long> {
    List<DoctorSlot> findByDoctor(User doctor);

    List<DoctorSlot> findByDoctorAndDate(User doctor, LocalDate date);

    List<DoctorSlot> findByDoctorAndDateAndStartTimeAndEndTime(User doctor, LocalDate date,
            java.time.LocalTime startTime, java.time.LocalTime endTime);
}
