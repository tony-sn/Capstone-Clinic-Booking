import { revalidatePath } from "next/cache";
import { Endpoints } from "@/lib/app.config";
import type { DoctorsResponse, DoctorDTO } from "@/types/doctor";

const handleApiResponse = async (res: Response) => {
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  } else {
    const textResponse = await res.text();
    try {
      return JSON.parse(textResponse);
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
      throw new Error("Invalid response format");
    }
  }
};

export const getAllDoctors = async ({
  pageSize = 5,
  pageNumber = 1,
}: {
  pageSize?: number;
  pageNumber?: number;
}): Promise<DoctorsResponse> => {
  try {
    console.log("DOCTOR endpoint:", Endpoints.DOCTOR);
    const res = await fetch(
      `${Endpoints.DOCTOR}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await handleApiResponse(res);

    // Nếu là response bọc theo kiểu { data, status, message }
    if (data && typeof data === "object" && "data" in data) {
      return data;
    }

    return {
      data: Array.isArray(data) ? data : [],
      pagination: {
        pageNumber,
        pageSize,
        totalItems: 0,
        totalPages: 0,
      },
      message: "",
      status: 200,
    };
  } catch (error) {
    console.error("Failed to fetch doctor list:", error);
    return {
      data: [],
      pagination: {
        pageNumber,
        pageSize,
        totalItems: 0,
        totalPages: 0,
      },
      message: "Error fetching doctors",
      status: 500,
    };
  }
};

export const getDoctorById = async (id: number): Promise<DoctorDTO | null> => {
  try {
    const res = await fetch(`${Endpoints.DOCTOR}/${id}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await handleApiResponse(res);
    return data;
  } catch (error) {
    console.error(`Failed to fetch doctor with ID ${id}:`, error);
    return null;
  }
};

export const createDoctor = async (formData: FormData): Promise<{
  success: boolean;
  data?: DoctorDTO;
  error?: string;
}> => {
  try {
    const res = await fetch(`${Endpoints.DOCTOR}`, {
      method: "POST",
      body: formData,
    });

    const data = await handleApiResponse(res);

    revalidatePath("/doctor");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Failed to create doctor:", error);
    return {
      success: false,
      error: "Error creating doctor",
    };
  }
};

export const updateDoctor = async (
  id: number,
  formData: FormData
): Promise<{
  success: boolean;
  data?: DoctorDTO;
  error?: string;
}> => {
  try {
    const res = await fetch(`${Endpoints.DOCTOR}/${id}`, {
      method: "PUT",
      body: formData,
    });

    const data = await handleApiResponse(res);

    revalidatePath("/doctor");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Failed to update doctor:", error);
    return {
      success: false,
      error: "Error updating doctor",
    };
  }
};

export const deleteDoctorById = async (
  id: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch(`${Endpoints.DOCTOR}/DeleteById/${id}`, {
      method: "PUT",
    });

    const data = await handleApiResponse(res);

    revalidatePath("/doctor");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete doctor:", error);
    return {
      success: false,
      error: "Error deleting doctor",
    };
  }
};
