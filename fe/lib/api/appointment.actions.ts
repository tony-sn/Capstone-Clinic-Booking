"use server";

import { revalidatePath } from "next/cache";

import { Endpoints } from "@/lib/app.config";
import type {
  AppointmentsResponse,
  AppointmentResponse,
  AppointmentParams,
} from "@/types/appointment";

export const getAllAppointment = async (
  params: AppointmentParams = { pageSize: 5, pageNumber: 1 }
): Promise<AppointmentsResponse> => {
  try {
    console.log("Appointment endpoint:", Endpoints.APPOINTMENT);
    const res = await fetch(
      `${Endpoints.APPOINTMENT}?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch appointments");
    }

    const data: AppointmentsResponse = await res.json();
    return data;
  } catch (error) {
    console.error(
      "An error occurred while retrieving all appointments:",
      error
    );
    return {
      status: 500,
      message: "Error fetching appointments",
      data: [],
      pagination: {
        pageNumber: params.pageNumber ?? 1,
        pageSize: params.pageSize ?? 5,
        totalItems: 0,
        totalPages: 0,
      },
    };
  }
};

export const getAppointmentsByMedicalHistoryId = async (
  medicalHistoryId: number
) => {
  try {
    const res = await fetch(
      `${Endpoints.APPOINTMENT}?pageSize=0&pageNumber=1`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch appointments");
    }

    const data = await res.json();

    // Filter appointments by medicalHistoryId on the client side
    const filteredAppointments = data.data
      ? data.data.filter(
          (appointment: { medicalHistoryId: number }) =>
            appointment.medicalHistoryId === medicalHistoryId
        )
      : [];

    return {
      ...data,
      data: filteredAppointments,
    };
  } catch (error) {
    console.error(
      "An error occurred while retrieving appointments by medical history ID:",
      error
    );
    throw error;
  }
};

export const getAppointmentById = async (
  id: number
): Promise<AppointmentResponse> => {
  const res = await fetch(`${Endpoints.APPOINTMENT}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch appointment by ID");
  }

  const data: AppointmentResponse = await res.json();
  return data;
};

export const getAppointmentsByPatientId = async (
  patientId: number,
  params: AppointmentParams = { pageSize: 0, pageNumber: 1 }
): Promise<AppointmentsResponse> => {
  try {
    const allAppointments = await getAllAppointment(params);

    const filteredData = allAppointments.data.filter(
      (appointment) => appointment.bookByUserId === patientId
    );

    return {
      ...allAppointments,
      data: filteredData,
      pagination: {
        ...allAppointments.pagination,
        totalItems: filteredData.length,
        totalPages: Math.ceil(filteredData.length / (params.pageSize || 10)),
      },
    };
  } catch (error) {
    console.error(
      "An error occurred while retrieving patient appointments:",
      error
    );
    return {
      status: 500,
      message: "Error fetching patient appointments",
      data: [],
      pagination: {
        pageNumber: params.pageNumber ?? 1,
        pageSize: params.pageSize ?? 5,
        totalItems: 0,
        totalPages: 0,
      },
    };
  }
};

export const createAppointment = async (formData: FormData) => {
  const res = await fetch(`${Endpoints.APPOINTMENT}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to create appointment");
  }

  revalidatePath("/appointments");
  return res.json();
};

export const updateAppointment = async (id: number, formData: FormData) => {
  const res = await fetch(`${Endpoints.APPOINTMENT}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update appointment");
  }

  revalidatePath("/appointments");
  return res.json();
};

export const deleteAppointmentById = async (id: number) => {
  const res = await fetch(`${Endpoints.APPOINTMENT}/DeleteById/${id}`, {
    method: "PUT",
  });

  if (!res.ok) {
    throw new Error("Failed to delete appointment");
  }

  revalidatePath("/appointments");
  return res.json();
};
