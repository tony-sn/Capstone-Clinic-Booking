using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public class DepartmentService(IDepartmentRepository departmentRepository) : IDepartmentService
    {
        public async Task<DepartmentDTO> Create(DepartmentRequest request)
        {
            var department = new Department
            {
                DepartmentName = request.Name,
            };
            var result = await departmentRepository.Create(department);
            return result == null ? throw new ArgumentException($"invalid create request") : DepartmentDTO.ConvertToDTO(result);
        }

        public async Task<DepartmentDTO> DeleteById(int id)
        {
            var result = await departmentRepository.DeleteById(id);
            return DepartmentDTO.ConvertToDTO(result);
        }

        public async Task<PageResultUlt<IEnumerable<DepartmentDTO>>> GetAll(int pageSize = 0, int pageNumber = 1)
        {
            if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0) throw new ArgumentException($"inlvalid page number:{pageNumber}");
            var departmentList = await departmentRepository.GetAllDepartmentsAsync();
            if (departmentList == null) return null;
            var totalItems = departmentList.Count();
            if (pageSize > 0)
            {
                departmentList = departmentList.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }
            return new PageResultUlt<IEnumerable<DepartmentDTO>>
            {
                Items = departmentList.Select(x => DepartmentDTO.ConvertToDTO(x)),
                TotalItems = totalItems
            };
        }

        public async Task<DepartmentDTO> GetById(int id)
        {
            var item = await departmentRepository.GetById(id);
            if (item == null) throw new ArgumentException($"invalid Id:{id}");
            return DepartmentDTO.ConvertToDTO(item);
        }

        public async Task<DepartmentDTO> Update(int id, DepartmentRequest departmentRequest)
        {
            var item = new Department
            {
                DepartmentName = departmentRequest.Name,
            };
            var result = await departmentRepository.Update(id, item);
            return DepartmentDTO.ConvertToDTO(result);
        }
    }
}
