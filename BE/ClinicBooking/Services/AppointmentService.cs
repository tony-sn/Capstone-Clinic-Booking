using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking.Services.IServices;

namespace ClinicBooking.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _repository;

        public AppointmentService(IAppointmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<AppointmentDTO>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return list.Select(AppointmentDTO.ConvertToDTO);
        }

        public async Task<AppointmentDTO> GetById(int id)
        {
            var item = await _repository.GetById(id);
            if (item == null) return null;
            return AppointmentDTO.ConvertToDTO(item);
        }

        public async Task<AppointmentDTO> Create(AppointmentRequest request)
        {
            var entity = new Appointment
            {
                DoctorId = request.DoctorId,
                BookByUserID = request.BookByUserId,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Price = request.Price,
                AppointmentStatus = request.AppointmentStatus,
                MedicalHistoryId = request.MedicalHistoryId,
                Doctor = null,
                BookByUser = null,
                MedicalHistory = null,
            };
            var created = await _repository.Create(entity);
            return AppointmentDTO.ConvertToDTO(created);
        }

        public async Task<AppointmentDTO> Update(int id, AppointmentRequest appointmentRequest)
        {
            var entity = new Appointment
            {
                AppointmentID = id,
                DoctorId = appointmentRequest.DoctorId,
                BookByUserID = appointmentRequest.BookByUserId,
                StartTime = appointmentRequest.StartTime,
                EndTime = appointmentRequest.EndTime,
                Price = appointmentRequest.Price,
                AppointmentStatus = appointmentRequest.AppointmentStatus,
                MedicalHistoryId = appointmentRequest.MedicalHistoryId,
                Doctor = null,
                BookByUser = null,
                MedicalHistory = null,
            };
            var updated = await _repository.Update(id, entity);
            return AppointmentDTO.ConvertToDTO(updated);
        }

        public async Task<AppointmentDTO> DeleteById(int id)
        {
            var deleted = await _repository.DeleteById(id);
            return AppointmentDTO.ConvertToDTO(deleted);
        }
    }
}