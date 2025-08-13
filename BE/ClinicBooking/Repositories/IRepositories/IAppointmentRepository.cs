using System.Security.Principal;
using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;

namespace ClinicBooking.Repositories.IRepositories
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<Appointment>> GetAllAsync();
        Task<IEnumerable<Appointment>> GetAllAsync(AppointmentStatus? status = null, DateTime? startDate = null, DateTime? endDate = null, int? doctorId = null, int? departmentId = null, int? patientId = null);
        Task<Appointment> GetById(int id);
        Task<Appointment> Create(Appointment appointment);
        Task<Appointment> Update(int id, Appointment appointment);
        Task<Appointment> DeleteById(int id);
    }
}