using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public interface IDoctorService
    {
        Task<PageResultUlt<IEnumerable<DoctorDTO>>> GetAll(int? departmentID, int pageSize = 0, int pageNumber = 1);
        Task<DoctorDTO> GetById(int id);
        Task<DoctorDTO> Create(DoctorRequest request);
        Task<DoctorDTO> Update(int id, DoctorRequest doctorRequest);
        Task<DoctorDTO> DeleteById(int id);
    }
}