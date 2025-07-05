export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T[];
    pagination: Pagination;
}

export interface LaboratoryTestReportResult {
    medicalHistoryId: number;
    laboratoryTestId: number;
    result: string;
    active: boolean;
    technician: Technician;
}
export interface CreateLaboratoryTestReportRequest {
    medicalHistoryId: number;
    laboratoryTestId: number;
    result: string;
    technicianId: number
}

export interface UpdateLaboratoryTestReportRequest {
    medicalHistoryId: number;
    laboratoryTestId: number;
    result: string;
    technicianId: number;
    status: boolean
}
export interface LaboratoryTestReportQueryParam {
    PageSize: number, PageNumber: number, Result: string | null
}
interface Technician {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface Pagination {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

// Usage type
type LaboratoryTestsReportResult = ApiResponse<LaboratoryTestReportResult[]>;