// types/medicine.ts

export interface ApiResponse<T = any> {
    status: number;
    message: string;
    data: T;
    pagination?: PaginationInfo;
  }
  
  export interface PaginationInfo {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages?: number; // optional, vì API bạn không trả totalPages
  }
  
  // DTO từ API trả về
  export interface Medicine {
    medicineID: number;
    medicineName: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }
  
  // Dữ liệu gửi lên khi tạo/sửa thuốc
  export interface MedicineRequest {
    medicineName: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }
  
  // Kiểu phản hồi có danh sách thuốc (dùng trong getAll)
  export type MedicineListResponse = ApiResponse<Medicine[]>;
  
  // Kiểu phản hồi 1 thuốc (dùng trong getById, create, update)
  export type MedicineResponse = ApiResponse<Medicine>;
  