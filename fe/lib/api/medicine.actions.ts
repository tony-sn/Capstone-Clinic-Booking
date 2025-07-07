"use server";

import { revalidatePath } from "next/cache";

import { Endpoints } from "@/lib/app.config";

export const getAllMedicine = async ({ pageSize = 5, pageNumber = 1 }) => {
  try {
    const res = await fetch(
      `${Endpoints.MEDICINE}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch medicines");
    }

    return res.json();
  } catch (error) {
    console.error("An error occurred while retrieving medicines:", error);
  }
};

export const getMedicineById = async (id: number) => {
  const res = await fetch(`${Endpoints.MEDICINE}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch medicine by ID");
  }

  return res.json();
};

export const createMedicine = async (formData: FormData) => {
  const res = await fetch(`${Endpoints.MEDICINE}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to create medicine");
  }

  revalidatePath("/medicines");
  return res.json();
};

export const updateMedicine = async (id: number, formData: FormData) => {
  const res = await fetch(`${Endpoints.MEDICINE}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update medicine");
  }

  revalidatePath("/medicine");
  return res.json();
};

export const deleteMedicineById = async (id: number) => {
  const res = await fetch(`${Endpoints.MEDICINE}/DeleteById/${id}`, {
    method: "PUT",
  });

  if (!res.ok) {
    throw new Error("Failed to delete medicine");
  }

  revalidatePath("/medicines");
  return res.json();
};
