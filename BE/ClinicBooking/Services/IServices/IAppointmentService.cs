using ClinicBooking.Models;
using ClinicBooking_Utility;
using ClinicBooking.Models.DTOs;

namespace ClinicBooking.Services.IServices;

public interface IAppointmentService
{
    Task<PageResultUlt<IEnumerable<AppointmentDTO>>> GetAll(int pageSize = 0, int pageNumber = 1);
    Task<AppointmentDTO> GetById(int id);
    Task<AppointmentDTO> Create(AppointmentRequest request);
    Task<AppointmentDTO> Update(int id, AppointmentRequest appointmentRequest);
    Task<AppointmentDTO> DeleteById(int id);
}