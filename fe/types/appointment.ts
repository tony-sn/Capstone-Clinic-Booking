 
enum AppointmentStatus {
  Booked = 0,
  Pending = 1,
  Examined = 2,
}

export type Appointment = {
  id: number;
  doctorId: number;
  bookByUserId: number;
  startTime: Date | string;
  endTime: Date | string;
  price: number;
  appointmentStatus:
    | AppointmentStatus.Booked
    | AppointmentStatus.Pending
    | AppointmentStatus.Examined;
  medicalHistoryId: number | null;
};
