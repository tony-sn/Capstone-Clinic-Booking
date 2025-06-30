"use server";

import { revalidatePath } from "next/cache";

import { Endpoints } from "@/lib/app.config";

export const getAllLaboratoryTest = async ({
  pageSize = 5,
  pageNumber = 1,
}) => {
  try {
    const res = await fetch(
      `${Endpoints.LABORATORY_TEST}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch laboratory tests");
    }

    return res.json();
  } catch (error) {
    console.error(
      "An error occurred while retrieving laboratory tests:",
      error,
    );
  }
};

export const getLaboratoryTestById = async (id: number) => {
  const res = await fetch(`${Endpoints.LABORATORY_TEST}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch laboratory test by ID");
  }

  return res.json();
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
