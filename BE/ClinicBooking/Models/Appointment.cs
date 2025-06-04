using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models
{
    public class Appointment
    {
        [Key]
        public int AppointmentID { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int BookByUserID { get; set; }
        public DateTime StartTime { get; set; }
        public int MyProperty { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        public decimal? Price { get; set; }
        [Required]
        public AppointmentStatus AppointmentStatus { get; set; }
    }

    public enum AppointmentStatus
    {
        Booked,
        Pending,
        Examined
    }
}
