using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models
{
    public class Image : EntityBase
    {
        [Key]
        public int ImageID { get; set; }

        [Required]
        public string FileName { get; set; }

        [Required]
        public string FileExtension { get; set; }

        [Required]
        public string Path { get; set; }
        public int LaboratoryTestReportMedicalHistoryId { get; set; }
        public int LaboratoryTestReportLaboratoryTestId { get; set; }

        // Navigation property
        public LaboratoryTestReport LaboratoryTestReport { get; set; }

    }
}
