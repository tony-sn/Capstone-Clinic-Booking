using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models
{
    public class MedicineInventoryEntry : EntityBase
    {
        public int Id { get; set; }
        public int MedicineID { get; set; }
        public Medicine Medicine { get; set; }

        [Required]
        public ChangeType ChangeType { get; set; }

        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        public DateTime Timestamp { get; set; }
        public string CompanyName { get; set; }
        public string Note { get; set; }
        public int PrescriptionID { get; set; }
        public Prescription Prescription { get; set; }
    }

    public enum ChangeType
    {
        Inbound,
        Outbound,
        Used,
        Return
    }
}
