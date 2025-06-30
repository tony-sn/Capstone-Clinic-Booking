using ClinicBooking.Models;

namespace ClinicBooking.Repositories.IRepositories;

public interface IMedicalHistoryRepository
{
    Task<IEnumerable<MedicalHistory>> GetAllAsync();
    Task<MedicalHistory?> GetById(int id);
    Task<MedicalHistory> Create(MedicalHistory medicalHistory);
    Task<MedicalHistory> Update(int id, MedicalHistory medicalHistory);
    Task<MedicalHistory> DeleteById(int id);
}