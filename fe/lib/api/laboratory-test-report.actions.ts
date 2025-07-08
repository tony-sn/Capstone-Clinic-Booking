"use server";
import console from "console";

import { revalidatePath } from "next/cache";

import { Endpoints } from "@/lib/app.config";
import { ApiResponse } from "@/types/laboratoryTest";
import {
  LaboratoryTestReportQueryParam,
  LaboratoryTestReportResult,
  CreateLaboratoryTestReportRequest,
  UpdateLaboratoryTestReportRequest,
} from "@/types/laboratoryTestReport";
const handleApiResponse = async (res: Response) => {
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  } else {
    // Handle text/plain response
    const textResponse = await res.text();
    try {
      return JSON.parse(textResponse);
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
      throw new Error("Invalid response format");
    }
  }
};
export const getAllMedicalHistory = async (
  params: LaboratoryTestReportQueryParam = {
    PageSize: 0,
    PageNumber: 1,
    Result: null,
  }
): Promise<LaboratoryTestReportResult[]> => {
  try {
    const res = await fetch(
      `${Endpoints.LABORATORY_TEST_REPORT}?pageSize=0&pageNumber=${params.PageNumber}${params.Result ? `&result=${params.Result}` : ""}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json", // Request JSON instead of text/plain
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch medical history");
    }

    // Check content type
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      // JSON response
      const response = await res.json();

      // Handle wrapped response
      if (response && typeof response === "object" && "data" in response) {
        return Array.isArray(response.data) ? response.data : [];
      }

      return Array.isArray(response) ? response : [];
    } else {
      // Text/plain response - parse as JSON
      const textResponse = await res.text();

      try {
        const parsedData = JSON.parse(textResponse);

        // Handle wrapped response
        if (
          parsedData &&
          typeof parsedData === "object" &&
          "data" in parsedData
        ) {
          return Array.isArray(parsedData.data) ? parsedData.data : [];
        }

        return Array.isArray(parsedData) ? parsedData : [];
      } catch (parseError) {
        console.error("Failed to parse text response as JSON:", parseError);
        return [];
      }
    }
  } catch (error) {
    console.error("An error occurred while retrieving medical history:", error);
    return [];
  }
};

// Get single medical history report by IDs
export const getMedicalHistoryReport = async (
  medicalHistoryId: number,
  laboratoryTestId: number
): Promise<LaboratoryTestReportResult | null> => {
  try {
    const res = await fetch(
      `${Endpoints.LABORATORY_TEST_REPORT}/${medicalHistoryId}/${laboratoryTestId}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch report: ${res.status}`);
    }

    // Handle both text/plain and application/json responses
    const contentType = res.headers.get("content-type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
      responseData = await res.json();
    } else {
      // Text response - parse as JSON
      const textResponse = await res.text();
      responseData = JSON.parse(textResponse);
    }

    // API returns wrapped response
    const apiResponse: ApiResponse<LaboratoryTestReportResult> = responseData;

    if (apiResponse.status === 200 && apiResponse.data) {
      return apiResponse.data;
    }

    throw new Error(apiResponse.message || "Unknown error");
  } catch (error) {
    console.error("Error fetching medical history report:", error);
    return null;
  }
};
// CREATE - New function
export const createLaboratoryTestReport = async (
  data: CreateLaboratoryTestReportRequest
): Promise<{
  success: boolean;
  data?: LaboratoryTestReportResult;
  error?: string;
}> => {
  try {
    const res = await fetch(Endpoints.LABORATORY_TEST_REPORT, {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await handleApiResponse(res);

    if (responseData && responseData.status === 201) {
      revalidatePath("/laboratory-test-reports");
      return {
        success: true,
        data: responseData.data,
      };
    }

    return {
      success: false,
      error: responseData.message || "Failed to create report",
    };
  } catch (error) {
    console.error("Error creating laboratory test report:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// UPDATE - New function
export const updateLaboratoryTestReport = async (
  medicalHistoryId: number,
  laboratoryTestId: number,
  data: Partial<UpdateLaboratoryTestReportRequest>
): Promise<{
  success: boolean;
  data?: LaboratoryTestReportResult;
  error?: string;
}> => {
  try {
    // Build the complete payload with required IDs
    const updatePayload = {
      medicalHistoryId,
      laboratoryTestId,
      result: data.result,
      technicianId: data.technicianId,
      status: data.status, // Convert 'active' to 'status'
    };

    const res = await fetch(`${Endpoints.LABORATORY_TEST_REPORT}`, {
      method: "PUT",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload), // Send complete payload
    });

    const responseData = await handleApiResponse(res);

    if (responseData && responseData.status === 202) {
      revalidatePath("/laboratory-test-reports");
      return {
        success: true,
        data: responseData.data,
      };
    }

    return {
      success: false,
      error: responseData.message || "Failed to update report",
    };
  } catch (error) {
    console.error("Error updating laboratory test report:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
// DELETE - New function
export const deleteLaboratoryTestReport = async (
  medicalHistoryId: number,
  laboratoryTestId: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch(
      `${Endpoints.LABORATORY_TEST_REPORT}/Delete/${medicalHistoryId}/${laboratoryTestId}`, // Added /Delete
      {
        method: "PUT", // Keep PUT as per your curl example
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await handleApiResponse(res);

    if (responseData.status === 204) {
      // Changed from 204 to 200
      revalidatePath("/laboratory-test-reports");
      return { success: true };
    }

    return {
      success: false,
      error: responseData.message || "Failed to delete report",
    };
  } catch (error) {
    console.error("Error deleting laboratory test report:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
