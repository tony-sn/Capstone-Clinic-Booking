using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs
{
    public class MedicineInventoryEntryDTO
    {
        public int Id { get; set; }
        public int MedicineID { get; set; }
        public ChangeType ChangeType { get; set; }
        public int Quantity { get; set; }
        public string CompanyName { get; set; }
        public string Note { get; set; }
        public int? PrescriptionID { get; set; }
        public static MedicineInventoryEntryDTO ConvertToDTO(MedicineInventoryEntry medicineInventoryEntry)
        {
            return new MedicineInventoryEntryDTO
            {
                Id = medicineInventoryEntry.Id,
                MedicineID = medicineInventoryEntry.MedicineID,
                ChangeType = medicineInventoryEntry.ChangeType,
                CompanyName = medicineInventoryEntry.CompanyName,
                Quantity = medicineInventoryEntry.Quantity,
                Note = medicineInventoryEntry.Note,
                PrescriptionID = medicineInventoryEntry.PrescriptionID
            };
        }
    }

    public class MedicineInventoryEntryRequest
    {

        [Required]
        public int MedicineID { get; set; }

        [Required]
        public ChangeType ChangeType { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        public string CompanyName { get; set; }
        public string Note { get; set; }
        public int PrescriptionID { get; set; }
    }
}
