using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs
{
    public class PrescriptionDetailDTO
    {
        public int PrescriptionID { get; set; }
        public int MedicineID { get; set; }

        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; }

        public string Usage { get; set; }

        public static PrescriptionDetailDTO ConvertToDTO(PrescriptionDetail prescription)
        {
            return new PrescriptionDetailDTO
            {
                PrescriptionID = prescription.PrescriptionID,
                MedicineID = prescription.MedicineID,
                Quantity = prescription.Quantity,
                Amount = prescription.Amount,
                Usage = prescription.Usage
            };
        }
    }

    public class PrescriptionDetailRequest
    {
        [Required]
        public int PrescriptionID { get; set; }
        [Required]
        public int MedicineID { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }
        public string Usage { get; set; }
    }
}
