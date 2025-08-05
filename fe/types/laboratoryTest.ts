export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface LaboratoryTestReport {
  id: number;
  name: string;
  description: string;
  price: number;
  active: boolean;
}

// Usage example
export type LaboratoryTestReportsResponse = ApiResponse<LaboratoryTestReport[]>;
//export type LaboratoryTestReportResponse = ApiResponse<LaboratoryTestReport>;
