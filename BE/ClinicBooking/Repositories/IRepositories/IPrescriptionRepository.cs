using ClinicBooking.Models;

namespace ClinicBooking.Repositories.IRepositories
{
    public interface IPrescriptionRepository
    {
        Task<IEnumerable<Prescription>> GetAllAsync();
        Task<IEnumerable<Prescription>> GetAllByMedicalHistoryIdAsync(int id);
        Task<Prescription> GetById(int id);

        Task<Prescription> Create(Prescription prescription);
        Task<Prescription> Update(int id, Prescription prescription);
        Task<Prescription> DeleteById(int id);
    }
}
