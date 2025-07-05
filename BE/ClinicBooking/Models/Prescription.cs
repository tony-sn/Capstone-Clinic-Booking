using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models
{
    public class Prescription : EntityBase
    {
        [Key]
        public int PrescriptionID { get; set; }
        public int MedicalHistoryID { get; set; }
        public MedicalHistory MedicalHistory { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; } //PrescriptionDetail.Amount.GellAll()

        public ICollection<PrescriptionDetail> PrescriptionDetails
        {
            get; set;
        }
    }
}
