export interface DepartmentDTO {
  id: number;
  name: string;
}

export interface DoctorDTO {
  id: number;
  departmentID: number;
  department: DepartmentDTO;
  certificate: string;
  userId: number;
  firstName: string;
  lastName: string;
  active: boolean;
}

export interface Pagination {
  pageSize: number;
  pageNumber: number;
  totalItems: number;
  totalPages: number;
}

export interface DoctorsResponse {
  status: number;
  message: string;
  data: DoctorDTO[];
  pagination: Pagination;
}
