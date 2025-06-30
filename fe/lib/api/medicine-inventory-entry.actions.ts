"use server";

import { revalidatePath } from "next/cache";

import { Endpoints } from "@/lib/app.config";

export const getAllMedicineInventoryEntries = async ({
  pageSize = 5,
  pageNumber = 1,
}) => {
  try {
    const res = await fetch(
      `${Endpoints.MEDICINE_INVENTORY_ENTRY}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch medicine inventory entries");
    }

    return res.json();
  } catch (error) {
    console.error(
      "An error occurred while retrieving medicine inventory entries:",
      error,
    );
  }
};

export const getMedicineInventoryEntryById = async (id: number) => {
  const res = await fetch(`${Endpoints.MEDICINE_INVENTORY_ENTRY}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch medicine inventory entry by ID");
  }

  return res.json();
};

export const createMedicineInventoryEntry = async (formData: FormData) => {
  const res = await fetch(`${Endpoints.MEDICINE_INVENTORY_ENTRY}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to create medicine inventory entry");
  }

  revalidatePath("/medicine-inventory-entries");
  return res.json();
};

export const updateMedicineInventoryEntry = async (
  id: number,
  formData: FormData,
) => {
  const res = await fetch(`${Endpoints.MEDICINE_INVENTORY_ENTRY}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update medicine inventory entry");
  }

  revalidatePath("/medicine-inventory-entries");
  return res.json();
};

export const deleteMedicineInventoryEntryById = async (id: number) => {
  const res = await fetch(
    `${Endpoints.MEDICINE_INVENTORY_ENTRY}/DeleteById/${id}`,
    {
      method: "PUT",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to delete medicine inventory entry");
  }

  revalidatePath("/medicine-inventory-entries");
  return res.json();
};
