using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs
{
    public class MedicineDTO
    {
        
        public int MedicineID { get; set; }
        public string MedicineName { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        public static MedicineDTO ConvertToDTO(Medicine medicine)
        {
            return new MedicineDTO
            {
                MedicineID = medicine.MedicineID,
                MedicineName = medicine.MedicineName,
                Description = medicine.Description,
                Quantity = medicine.Quantity,
                UnitPrice = medicine.UnitPrice
            };
        }
    }

    public class MedicineRequest
    {
        
        [Required]
        [MaxLength(100, ErrorMessage = "Tên thuốc không vượt quá 100 ký tự")]
        public string MedicineName { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal UnitPrice { get; set; }
    }
}
