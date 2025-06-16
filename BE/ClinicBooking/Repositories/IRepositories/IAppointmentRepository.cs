using System.Security.Principal;
using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;

namespace ClinicBooking.Repositories.IRepositories
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<Appointment>> GetAllAsync();
        Task<Appointment> GetById(int id);
        Task<Appointment> Create(Appointment appointment);
        Task<Appointment> Update(int id, Appointment appointment);
        Task<Appointment> DeleteById(int id);
    }
}