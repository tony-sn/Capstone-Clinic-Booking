using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicBooking.Models
{
    public class Appointment : EntityBase
    {
        [Key]
        public int AppointmentID { get; set; }
        [Required]
        [ForeignKey("User")]
        public int DoctorId { get; set; }
        public required User Doctor { get; set; }
        [Required]
        [ForeignKey("BookByUser")]
        public int BookByUserID { get; set; }
        public required User BookByUser { get; set; }
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        public decimal? Price { get; set; }
        [Required]
        public AppointmentStatus AppointmentStatus { get; set; }
        public int MedicalHistoryId { get; set; }
        public required MedicalHistory MedicalHistory { get; set; }
    }

    public enum AppointmentStatus
    {
        Booked,
        Pending,
        Examined
    }
}
