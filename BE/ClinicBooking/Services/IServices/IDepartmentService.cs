using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public interface IDepartmentService
    {
        Task<PageResultUlt<IEnumerable<DepartmentDTO>>> GetAll(int pageSize = 0, int pageNumber = 1);
        Task<DepartmentDTO> GetById(int id);
        Task<DepartmentDTO> Create(DepartmentRequest request);
        Task<DepartmentDTO> Update(int id, DepartmentRequest departmentRequest);
        Task<DepartmentDTO> DeleteById(int id);
    }
}