"use server";

import { revalidatePath } from "next/cache";

import { Endpoints } from "@/lib/app.config";

export const getAllPrescriptions = async ({ pageSize = 5, pageNumber = 1 }) => {
  try {
    const res = await fetch(
      `${Endpoints.PRESCRIPTION}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch prescriptions");
    }

    return res.json();
  } catch (error) {
    console.error("An error occurred while retrieving prescriptions:", error);
  }
};

export const getPrescriptionById = async (id: number) => {
  const res = await fetch(`${Endpoints.PRESCRIPTION}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch prescription by ID");
  }

  return res.json();
};

export const createPrescription = async (formData: FormData) => {
  const res = await fetch(`${Endpoints.PRESCRIPTION}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to create prescription");
  }

  revalidatePath("/prescriptions");
  return res.json();
};

export const updatePrescription = async (id: number, formData: FormData) => {
  const res = await fetch(`${Endpoints.PRESCRIPTION}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update prescription");
  }

  revalidatePath("/prescriptions");
  return res.json();
};

export const deletePrescriptionById = async (id: number) => {
  const res = await fetch(`${Endpoints.PRESCRIPTION}/DeleteById/${id}`, {
    method: "PUT",
  });

  if (!res.ok) {
    throw new Error("Failed to delete prescription");
  }

  revalidatePath("/prescriptions");
  return res.json();
};
