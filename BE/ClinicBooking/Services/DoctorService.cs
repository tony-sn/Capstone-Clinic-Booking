using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public class DoctorService(IDoctorRepository doctorRepository) : IDoctorService
    {
        public async Task<DoctorDTO> Create(DoctorRequest request)
        {
            var doctor = new Doctor
            {
                DepartmentID = request.DepartmentID,
                UserId = request.UserId,
                Certificate = request.Certificate
            };
            var result = await doctorRepository.Create(doctor);
            return result == null ? throw new ArgumentException($"invalid create request") : DoctorDTO.ConvertToDTO(result);
        }

        public async Task<DoctorDTO> DeleteById(int id)
        {
            var result = await doctorRepository.DeleteById(id);
            return DoctorDTO.ConvertToDTO(result);
        }

        public async Task<PageResultUlt<IEnumerable<DoctorDTO>>> GetAll(int? departmentID, int pageSize = 0, int pageNumber = 1)
        {
            if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0) throw new ArgumentException($"inlvalid page number:{pageNumber}");
            var doctorList = await doctorRepository.GetAllDoctorsAsync(departmentID);
            if (doctorList == null) return null;
            var totalItems = doctorList.Count();
            if (pageSize > 0)
            {
                doctorList = doctorList.Skip((1 - pageNumber) * pageSize).Take(pageSize).ToList();
            }
            return new PageResultUlt<IEnumerable<DoctorDTO>>
            {
                Items = doctorList.Select(x => DoctorDTO.ConvertToDTO(x)),
                TotalItems = totalItems
            };
        }

        public async Task<DoctorDTO> GetById(int id)
        {
            var item = await doctorRepository.GetById(id);
            if (item == null) throw new ArgumentException($"invalid Id:{id}");
            return DoctorDTO.ConvertToDTO(item);
        }

        public async Task<DoctorDTO> Update(int id, DoctorRequest request)
        {
            var item = new Doctor
            {
                DepartmentID = request.DepartmentID,
                UserId = request.UserId,
                Certificate = request.Certificate
            };
            var result = await doctorRepository.Update(id, item);
            return DoctorDTO.ConvertToDTO(result);
        }
    }
}
