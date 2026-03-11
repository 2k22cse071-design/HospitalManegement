package com.hospital.backend.service;

import com.hospital.backend.entity.DoctorSlot;
import com.hospital.backend.entity.User;
import com.hospital.backend.repository.DoctorSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorSlotService {

    private final DoctorSlotRepository doctorSlotRepository;

    public DoctorSlot addDoctorSlot(DoctorSlot slot) {
        return doctorSlotRepository.save(slot);
    }

    public List<DoctorSlot> getSlotsByDoctor(User doctor) {
        return doctorSlotRepository.findByDoctor(doctor);
    }

    public boolean checkDoctorAvailability(User doctor, LocalDate date, LocalTime startTime, LocalTime endTime) {
        List<DoctorSlot> slots = doctorSlotRepository.findByDoctorAndDate(doctor, date);
        return slots.stream()
                .anyMatch(slot -> (startTime.equals(slot.getStartTime()) || startTime.isAfter(slot.getStartTime())) &&
                        (endTime.equals(slot.getEndTime()) || endTime.isBefore(slot.getEndTime())));
    }
}
