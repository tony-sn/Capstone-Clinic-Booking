 
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
  active: boolean;
};

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AppointmentsResponse {
  status: number;
  message: string;
  data: Appointment[];
  pagination: Pagination;
}

export interface AppointmentResponse {
  status: number;
  message: string;
  data: Appointment;
}

export interface AppointmentParams {
  pageSize?: number;
  pageNumber?: number;
}
