using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicBooking.Models
{
    public class MedicalHistory : EntityBase
    {
        [Key]
        public int MedicalHistoryId { get; set; }
        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }
        public string? Symptoms { get; set; }
        public string? Diagnosis { get; set; }
        public string? TreatmentInstructions { get; set; }

        [ForeignKey("Doctor")]
        public int DoctorId { get; set; }
        public User Doctor { get; set; }

        [ForeignKey("Patient")]
        public int PatientId { get; set; }
        public User Patient { get; set; }
    }
}
