"use server";

import { Endpoints } from "@/lib/app.config";
import type { MedicalHistoryResponse, MedicalHistoryParams } from "@/types/medicalHistory";
import { revalidatePath } from "next/cache";

export const getAllMedicalHistory = async (
  params: MedicalHistoryParams = { pageSize: 0, pageNumber: 1 }
): Promise<MedicalHistoryResponse> => {
  try {
    //  `https://localhost:5000/api/MedicalHistory?pageSize=0&pageNumber=1`
    const res = await fetch(
      `${Endpoints.MEDICAL_HISTORY}?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch medical history");
    }
    const data: MedicalHistoryResponse = await res.json();

    return data;
  } catch (error) {
    console.error("An error occurred while retrieving medical history:", error);
    // Trả về object mặc định
    return {
      status: 500,
      message: "Error fetching medical history",
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
export const updateMedicalHistory = async (medicalHistoryId: number, formData: FormData) => {
  const res = await fetch(`${Endpoints.MEDICAL_HISTORY}/${medicalHistoryId}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Update failed:', errorText);
    throw new Error(`Failed to update medical history: ${res.status}`);
  }

  revalidatePath("/medical-histories");
  return res.json();
};

export const createMedicalHistory = async (formData: FormData) => {
  const res = await fetch(`${Endpoints.MEDICAL_HISTORY}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Create failed:', errorText);
    throw new Error(`Failed to create medical history: ${res.status}`);
  }

  revalidatePath("/medical-histories");
  return res.json();
};