"use server";

import { revalidatePath } from "next/cache";

import { Endpoints } from "@/lib/app.config";

// --- Log inventory activity ---
export const logInventoryEntry = async ({
  medicineID,
  changeType,
  quantity,
  companyName,
  note,
}: {
  medicineID: number;
  changeType: "Inbound" | "Outbound";
  quantity: number;
  companyName?: string;
  note?: string;
}) => {
  const formData = new FormData();
  formData.append("medicineID", medicineID.toString());
  formData.append("changeType", changeType);
  formData.append("quantity", quantity.toString());
  formData.append("companyName", companyName ?? "");
  formData.append("note", note ?? "");
  formData.append("prescriptionID", "");

  const res = await fetch(`${Endpoints.MEDICINE_INVENTORY_ENTRY}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    console.warn("Failed to log inventory entry:", await res.text());
  }
};

// --- Fetch medicines ---
export const getAllMedicine = async ({ pageSize = 5, pageNumber = 1 }) => {
  try {
    const res = await fetch(
      `${Endpoints.MEDICINE}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch medicines");
    }

    return res.json();
  } catch (error) {
    console.error("An error occurred while retrieving medicines:", error);
  }
};

// --- Get medicine by ID ---
export const getMedicineById = async (id: number) => {
  const res = await fetch(`${Endpoints.MEDICINE}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch medicine by ID");
  }

  return res.json();
};

// --- Create medicine ---
export const createMedicine = async (formData: FormData) => {
  const res = await fetch(`${Endpoints.MEDICINE}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to create medicine");
  }

  const result = await res.json();
  const medicine = result.data;

  const companyName = formData.get("companyName")?.toString() ?? "";

  if (medicine?.medicineID && medicine?.quantity > 0) {
    logInventoryEntry({
      medicineID: medicine.medicineID,
      changeType: "Inbound",
      quantity: medicine.quantity,
      companyName,
      note: "Initial stock entry",
    });
  }

  revalidatePath("/medicines");
  return result;
};

// --- Update medicine ---
export const updateMedicine = async (id: number, formData: FormData) => {
  const res = await fetch(`${Endpoints.MEDICINE}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update medicine");
  }

  revalidatePath("/medicines");
  return res.json();
};

// --- Delete medicine ---
export const deleteMedicineById = async (id: number) => {
  const res = await fetch(`${Endpoints.MEDICINE}/DeleteById/${id}`, {
    method: "PUT",
  });

  if (!res.ok) {
    throw new Error("Failed to delete medicine");
  }

  const result = await res.json();
  const medicine = result.data;

  if (medicine?.medicineID && medicine?.quantity > 0) {
    logInventoryEntry({
      medicineID: medicine.medicineID,
      changeType: "Outbound",
      quantity: medicine.quantity,
      companyName: "Removed from inventory",
      note: "Medicine deleted - entire stock removed",
    });
  }

  revalidatePath("/medicines");
  return result;
};
