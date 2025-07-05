export interface MedicalHistory {
  medicalHistoryId: number;
  totalAmount: number;
  symptoms: string | null;
  diagnosis: string | null;
  treatmentInstructions: string | null;
  doctorId: number;
  patientId: number;
  active: boolean
}
export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export interface MedicalHistoriesResponse {
  status: number;
  message: string;
  data: MedicalHistory[];
  pagination: Pagination;
}

export interface MedicalHistoryResponse {
  status: number;
  message: string;
  data: MedicalHistory;
}
export interface MedicalHistoryParams {
  pageSize?: number;
  pageNumber?: number | null;
}