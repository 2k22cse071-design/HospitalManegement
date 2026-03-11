package com.hospital.backend.controller;

import com.hospital.backend.dto.SlotRequest;
import com.hospital.backend.entity.DoctorSlot;
import com.hospital.backend.entity.User;
import com.hospital.backend.service.DoctorSlotService;
import com.hospital.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/slots")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DoctorSlotController {

    private final DoctorSlotService doctorSlotService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<DoctorSlot> addDoctorSlot(@RequestBody SlotRequest request) {
        User doctor = userService.getUserById(request.getDoctorId());

        DoctorSlot slot = DoctorSlot.builder()
                .doctor(doctor)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        return ResponseEntity.ok(doctorSlotService.addDoctorSlot(slot));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorSlot>> getSlotsByDoctor(@PathVariable Long doctorId) {
        User doctor = userService.getUserById(doctorId);
        return ResponseEntity.ok(doctorSlotService.getSlotsByDoctor(doctor));
    }
}
