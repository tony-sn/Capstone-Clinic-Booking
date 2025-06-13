using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs
{
    public class PrescriptionDTO
    {
        public int PrescriptionID { get; set; }
        public int MedicalHistoryID { get; set; }
        public decimal TotalAmount { get; set; }

        public static PrescriptionDTO ConvertToDTO(Prescription prescription)
        {
            return new PrescriptionDTO
            {
                PrescriptionID = prescription.PrescriptionID,
                MedicalHistoryID = prescription.MedicalHistoryID,
                TotalAmount = prescription.TotalAmount,
            };
        }
    }

    public class PrescriptionRequest
    {
        [Required]
        public int MedicalHistoryID { get; set; }
        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }
    }
}
