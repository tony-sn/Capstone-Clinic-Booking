export interface Prescription {
  prescriptionId: number;
  medicalHistoryId: number;
  totalAmount: number;
}

export interface PrescriptionResponse {
  status: number;
  message: string;
  data: Prescription;
}

export interface PrescriptionDetail {
  prescriptionId: number;
  medicineId: number;
  quantity: number;
  amount: number;
  usage: string;
}

export interface PrescriptionDetailResponse {
  status: number;
  message: string;
  data: PrescriptionDetail;
}

export interface PrescriptionParams {
  pageSize?: number;
  pageNumber?: number | null;
}
