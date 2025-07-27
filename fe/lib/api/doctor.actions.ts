import { revalidatePath } from "next/cache";

import { Endpoints } from "@/lib/app.config";

export const getAllDoctors = async ({ pageSize = 5, pageNumber = 1 }) => {
  try {
    const res = await fetch(
      `${Endpoints.DOCTOR}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch doctor list");
    }

    const data = await res.json();
    console.log("get all doctor: ", { data });
    return data;
  } catch (error) {
    console.error("An error occurred while retrieving all doctors:", error);
  }
};

export const getDoctorById = async (id: number) => {
  const res = await fetch(`${Endpoints.DOCTOR}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch doctor by ID");
  }

  return res.json();
};

export const createDoctor = async (formData: FormData) => {
  const res = await fetch(`${Endpoints.DOCTOR}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to create a doctor");
  }

  revalidatePath("/doctor");
  return res.json();
};

export const updateDoctor = async (id: number, formData: FormData) => {
  const res = await fetch(`${Endpoints.DOCTOR}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update doctor");
  }

  revalidatePath("/doctor");
  return res.json();
};

export const deleteDoctorById = async (id: number) => {
  const res = await fetch(`${Endpoints.DOCTOR}/DeleteById/${id}`, {
    method: "PUT",
  });

  if (!res.ok) {
    throw new Error("Failed to delete doctor");
  }

  revalidatePath("/doctor");
  return res.json();
};
