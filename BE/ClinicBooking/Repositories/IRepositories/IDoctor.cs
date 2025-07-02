using ClinicBooking.Models;

namespace ClinicBooking.Repositories.IRepositories
{


    public interface IDoctorRepository
    {
        Task<IEnumerable<Doctor>> GetAllDoctorsAsync(int? deparmentID);
        Task<Doctor> GetById(int id);

        Task<Doctor> Create(Doctor doctor);
        Task<Doctor> Update(int id, Doctor doctor);
        Task<Doctor> DeleteById(int id);
    }
}