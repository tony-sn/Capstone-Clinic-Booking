"use server";

import { Endpoints } from "@/lib/app.config";
import type { MedicalHistoriesResponse, MedicalHistoryParams, MedicalHistoryResponse } from "@/types/medicalHistory";
import { promises } from "dns";
import { revalidatePath } from "next/cache";

export const getAllMedicalHistory = async (
  params: MedicalHistoryParams = { pageSize: 0, pageNumber: 1 }
): Promise<MedicalHistoriesResponse> => {
  try {
    //  `https://localhost:5000/api/MedicalHistory?pageSize=0&pageNumber=1`
    const res = await fetch(
      `${Endpoints.MEDICAL_HISTORY}?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch medical history");
    }
    const data: MedicalHistoriesResponse = await res.json();

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
export const deleteMedicalHistoryById = async (medicalHistoryId: number): Promise<MedicalHistoryResponse> => {
  const url = `${Endpoints.MEDICAL_HISTORY}/DeleteById/${medicalHistoryId}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Delete failed:', errorText);
    throw new Error(`Failed to delete medical history: ${res.status} - ${errorText}`);
  }

  const response: MedicalHistoryResponse = await res.json();

  // Check response status from API
  if (response.status !== 204) {
    throw new Error(`API Error: ${response.message}`);
  }

  return response;
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

export const getMedicalHistoryById = async (id: number): Promise<MedicalHistoryResponse> => {
  const res = await fetch(`${Endpoints.MEDICAL_HISTORY}/DeleteById/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch medical history by ID");
  }

  const data: MedicalHistoryResponse = await res.json();
  return data; // Return full response object, not data.data
};