using ClinicBooking_Utility;
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

        public async Task<PageResultUlt<IEnumerable<AppointmentDTO>>> GetAll(int pageSize = 0, int pageNumber = 1)
        {
            if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0) throw new ArgumentException($"inlvalid page number:{pageNumber}");
            var list = await _repository.GetAllAsync();
            if (list == null) return null;
            var totalItems = list.Count();
            if (pageSize > 0)
            {
                list = list.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }

            return new PageResultUlt<IEnumerable<AppointmentDTO>>
            {
                Items = list.Select(x => AppointmentDTO.ConvertToDTO(x)),
                TotalItems = totalItems
            };
        }

        public async Task<PageResultUlt<IEnumerable<AppointmentDTO>>> GetAll(int pageSize = 0, int pageNumber = 1, AppointmentStatus? status = null, DateTime? startDate = null, DateTime? endDate = null, int? doctorId = null, int? departmentId = null, int? patientId = null)
        {
            if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0) throw new ArgumentException($"inlvalid page number:{pageNumber}");
            var list = await _repository.GetAllAsync(status, startDate, endDate, doctorId, departmentId, patientId);
            if (list == null) return null;
            var totalItems = list.Count();
            if (pageSize > 0)
            {
                list = list.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }

            return new PageResultUlt<IEnumerable<AppointmentDTO>>
            {
                Items = list.Select(x => AppointmentDTO.ConvertToDTO(x)),
                TotalItems = totalItems
            };
        }

        public async Task<AppointmentDTO> GetById(int id)
        {
            var item = await _repository.GetById(id);
            if (item == null) throw new ArgumentException($"invalid Id:{id}");
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
            var item = new Appointment
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
            var result = await _repository.Update(id, item);
            return AppointmentDTO.ConvertToDTO(result);
        }

        public async Task<AppointmentDTO> DeleteById(int id)
        {
            var deleted = await _repository.DeleteById(id);
            return AppointmentDTO.ConvertToDTO(deleted);
        }
    }
}