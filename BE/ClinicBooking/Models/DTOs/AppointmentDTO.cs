using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs
{
    public class AppointmentDTO
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public int BookByUserId { get; set; }
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
                BookByUserId = appointment.BookByUserID,
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