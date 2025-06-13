using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;

namespace ClinicBooking.Services.IServices
{
    public interface IMedicineInventoryEntryService
    {
        Task<PageResultUlt<IEnumerable<MedicineInventoryEntryDTO>>> GetAll(int pageSize = 0, int pageNumber = 1);
        Task<MedicineInventoryEntryDTO> GetById(int id);
        Task<MedicineInventoryEntryDTO> Create(MedicineInventoryEntryRequest request);
        Task<MedicineInventoryEntryDTO> Update(int id, MedicineInventoryEntryRequest medicineInventoryEntryRequest);
        Task<MedicineInventoryEntryDTO> DeleteById(int id);
    }
}
