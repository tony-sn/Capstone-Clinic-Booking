
"use server";

import { revalidatePath } from "next/cache";

import { Endpoints } from "@/lib/app.config";
import type { ApiResponse, LaboratoryTestReport } from "@/types/laboratoryTest"

export const getAllLaboratoryTest = async ({
  pageSize = 0,
  pageNumber = 1,
}): Promise<ApiResponse<LaboratoryTestReport[]>> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ENDPOINT}/api/LaboratoryTest?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch laboratory tests");
    }

    const result: ApiResponse<LaboratoryTestReport[]> = await res.json();

    // Return full response object, not just data
    return result;
  } catch (error) {
    console.error(
      "An error occurred while retrieving laboratory tests:",
      error,
    );
    throw error;
  }
};

export const getLaboratoryTestById = async (id: number): Promise<LaboratoryTestReport> => {
  const res = await fetch(`${Endpoints.LABORATORY_TEST}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch laboratory test by ID");
  }
  var data = await res.json();

  return data.data;
};

export const createLaboratoryTest = async (formData: FormData) => {
  const res = await fetch(`${Endpoints.LABORATORY_TEST}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to create laboratory test");
  }

  revalidatePath("/laboratory-tests");
  return res.json();
};

export const updateLaboratoryTest = async (id: number, formData: FormData) => {
  const res = await fetch(`${Endpoints.LABORATORY_TEST}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update laboratory test");
  }

  revalidatePath("/laboratory-tests");
  return res.json();
};

export const deleteLaboratoryTestById = async (id: number) => {
  const res = await fetch(`${Endpoints.LABORATORY_TEST}/DeleteById/${id}`, {
    method: "PUT",
  });

  if (!res.ok) {
    throw new Error("Failed to delete laboratory test");
  }

  revalidatePath("/laboratory-tests");
  return res.json();
};
