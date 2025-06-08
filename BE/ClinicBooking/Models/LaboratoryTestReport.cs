using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicBooking.Models
{
    [PrimaryKey(nameof(MedicalHistoryId), nameof(LaboratoryTestId))]
    public class LaboratoryTestReport : EntityBase
    {
        public int MedicalHistoryId { get; set; }
        public MedicalHistory MedicalHistory { get; set; }

        public int LaboratoryTestId { get; set; }
        public LaboratoryTest LaboratoryTest { get; set; }

        public ICollection<Image> Images { get; set; }

        public string Result { get; set; }

        [ForeignKey("Technician")]
        public int TechnicianId { get; set; }
        public required User Technician { get; set; }

    }
}
