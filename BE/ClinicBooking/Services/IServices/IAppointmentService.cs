using ClinicBooking.Models;
using ClinicBooking_Utility;
using ClinicBooking.Models.DTOs;

namespace ClinicBooking.Services.IServices;

public interface IAppointmentService
{
    Task<IEnumerable<AppointmentDTO>> GetAll();
    Task<AppointmentDTO> GetById(int id);
    Task<AppointmentDTO> Create(AppointmentRequest request);
    Task<AppointmentDTO> Update(int id, AppointmentRequest appointmentRequest);
    Task<AppointmentDTO> DeleteById(int id);
}