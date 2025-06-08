using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicBooking.Models
{
    public class MedicalHistory : EntityBase
    {
        public int MedicalHistoryId { get; set; }
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
        public string Symptoms { get; set; }
        public string Diagnosis { get; set; }
        public string TreatmentInstructions { get; set; }

        [ForeignKey("Doctor")]
        public int DoctorId { get; set; }
        public required User Doctor { get; set; }

        [ForeignKey("Patient")]
        public int PatientId { get; set; }
        public required User Patient { get; set; }
    }
}
