using ClinicBooking.Models;

namespace ClinicBooking.Repositories.IRepositories
{
    public interface IMedicineRepository
    {
        Task<IEnumerable<Medicine>> GetAllAsync();
        Task<Medicine> GetByIdAsync(int id);
        Task<Medicine> Create(Medicine medicine);
        Task<Medicine> UpdateById(int id, Medicine medicine);
        Task<Medicine> DeleteById(int id);
    }
}
