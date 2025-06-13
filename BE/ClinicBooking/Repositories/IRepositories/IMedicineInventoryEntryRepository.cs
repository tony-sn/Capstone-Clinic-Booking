using ClinicBooking.Models;

namespace ClinicBooking.Repositories.IRepositories
{
    public interface IMedicineInventoryEntryRepository
    {
        Task<IEnumerable<MedicineInventoryEntry>> GetAllAsync();
        Task<MedicineInventoryEntry> GetByIdAsync(int id);
        Task<MedicineInventoryEntry> Create(MedicineInventoryEntry medicineInventoryEntry);
        Task<MedicineInventoryEntry> UpdateById(int id, MedicineInventoryEntry medicineInventoryEntry);
        Task<MedicineInventoryEntry> DeleteById(int id);
    }
}
