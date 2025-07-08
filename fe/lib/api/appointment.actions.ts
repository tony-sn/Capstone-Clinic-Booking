"use server";

import { revalidatePath } from "next/cache";

import { Endpoints } from "@/lib/app.config";

export const getAllAppointment = async ({ pageSize = 5, pageNumber = 1 }) => {
  try {
    const res = await fetch(
      `${Endpoints.APPOINTMENT}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch appointments");
    }

    const data = await res.json();
    console.log("get all appointment: ", { data });
    return data;
  } catch (error) {
    console.error(
      "An error occurred while retrieving all appointments:",
      error
    );
  }
};

export const getAppointmentById = async (id: number) => {
  const res = await fetch(`${Endpoints.APPOINTMENT}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch appointment by ID");
  }

  return res.json();
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
