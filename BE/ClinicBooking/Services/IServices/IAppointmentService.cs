using ClinicBooking.Models;
using ClinicBooking_Utility;
using ClinicBooking.Models.DTOs;

namespace ClinicBooking.Services.IServices;

public interface IAppointmentService
{
    Task<PageResultUlt<IEnumerable<AppointmentDTO>>> GetAll(int pageSize = 0, int pageNumber = 1);
    Task<PageResultUlt<IEnumerable<AppointmentDTO>>> GetAll(int pageSize = 0, int pageNumber = 1, AppointmentStatus? status = null, DateTime? startDate = null, DateTime? endDate = null, int? doctorId = null, int? departmentId = null, int? patientId = null);
    Task<AppointmentDTO> GetById(int id);
    Task<AppointmentDTO> Create(AppointmentRequest request);
    Task<AppointmentDTO> Update(int id, AppointmentRequest appointmentRequest);
    Task<AppointmentDTO> DeleteById(int id);
}