async function testBooking() {
    try {
        let docRes = await fetch('http://localhost:8080/users/doctors');
        let docs = await docRes.json();
        let docId = docs[0].id;

        let patRes = await fetch('http://localhost:8080/users/patients');
        let pats = await patRes.json();
        let patId = pats[0].id;

        // Add a slot
        let addSlotRes = await fetch('http://localhost:8080/slots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                doctorId: docId,
                date: '2026-03-12',
                startTime: '15:00:00',
                endTime: '16:00:00'
            })
        });
        let addedSlot = await addSlotRes.json();
        console.log("Added slot:", addedSlot);

        // Fetch their slots
        let slotRes = await fetch('http://localhost:8080/slots/doctor/' + docId);
        let slots = await slotRes.json();
        let slot = slots.find(s => s.id === addedSlot.id);

        // Attempt booking
        console.log(`Booking for Pat:${patId}, Doc:${docId}, slot:${slot.startTime}`);
        let bookRes = await fetch('http://localhost:8080/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientId: patId,
                doctorId: docId,
                appointmentDate: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime
            })
        });

        console.log('Booking status:', bookRes.status);
        console.log('Booking response:', await bookRes.text());

    } catch (e) {
        console.error(e);
    }
}
testBooking();
