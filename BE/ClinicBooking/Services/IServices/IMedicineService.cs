using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;

namespace ClinicBooking.Services.IServices
{
    public interface IMedicineService
    {
        Task<PageResultUlt<IEnumerable<MedicineDTO>>> GetAll(int pageSize = 0, int pageNumber = 1);
        Task<MedicineDTO> GetById(int id);
        Task<MedicineDTO> Create(MedicineRequest request);
        Task<MedicineDTO> Update(int id, MedicineRequest medicineRequest);
        Task<MedicineDTO> DeleteById(int id);
    }
}
