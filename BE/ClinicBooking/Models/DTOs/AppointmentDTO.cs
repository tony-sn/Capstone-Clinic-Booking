using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs
{
    public class AppointmentDTO
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public string? DoctorName { get; set; }
        public string? DoctorCertificate { get; set; }
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int BookByUserId { get; set; }
        public string? PatientName { get; set; }
        public string? PatientEmail { get; set; }
        public string? PatientPhoneNumber { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal? Price { get; set; }
        public AppointmentStatus AppointmentStatus { get; set; }
        public int? MedicalHistoryId { get; set; }
        public bool Active { get; set; }

        public static AppointmentDTO ConvertToDTO(Appointment appointment)
        {
            return new AppointmentDTO
            {
                Id = appointment.AppointmentID,
                DoctorId = appointment.DoctorId,
                DoctorName = appointment.Doctor?.User != null ? $"{appointment.Doctor.User.FirstName} {appointment.Doctor.User.LastName}".Trim() : null,
                DoctorCertificate = appointment.Doctor?.Certificate,
                DepartmentId = appointment.Doctor?.DepartmentID,
                DepartmentName = appointment.Doctor?.Department?.DepartmentName,
                BookByUserId = appointment.BookByUserID,
                PatientName = appointment.BookByUser != null ? $"{appointment.BookByUser.FirstName} {appointment.BookByUser.LastName}".Trim() : null,
                PatientEmail = appointment.BookByUser?.Email,
                PatientPhoneNumber = appointment.BookByUser?.PhoneNumber,
                StartTime = appointment.StartTime,
                EndTime = appointment.EndTime,
                Price = appointment.Price,
                AppointmentStatus = appointment.AppointmentStatus,
                MedicalHistoryId = appointment.MedicalHistoryId,
                Active = appointment.Active
            };
        }
    }

    public class AppointmentRequest
    {
        [Required] public int DoctorId { get; set; }
        [Required] public int BookByUserId { get; set; }
        public DateTime StartTime { get; set; }
        [Required] public DateTime EndTime { get; set; }
        public decimal? Price { get; set; }
        [Required] public AppointmentStatus AppointmentStatus { get; set; }
        public int MedicalHistoryId { get; set; }
    }
}