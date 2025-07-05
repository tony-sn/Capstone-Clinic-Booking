using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models
{
    [PrimaryKey(nameof(PrescriptionID), nameof(MedicineID))]
    public class PrescriptionDetail : EntityBase
    {
        public int PrescriptionID { get; set; }
        public Prescription Prescription { get; set; }
        public int MedicineID { get; set; }
        public Medicine Medicine { get; set; }

        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; } // Quantity * Medicine.UnitPrice

        public string Usage { get; set; }

    }
}
