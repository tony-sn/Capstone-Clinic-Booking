using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models
{
    public class Medicine : EntityBase
    {
        [Key]
        public int MedicineID { get; set; }

        [Required, StringLength(100)]
        public string MedicineName { get; set; }

        public string Description { get; set; }

        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal UnitPrice { get; set; }
    }
}
