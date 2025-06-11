using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models
{
    public class Image : EntityBase
    {
        [Key]
        public int ImageID { get; set; }

        
        public string FileName { get; set; }

     
        public string FileExtension { get; set; }

     
        public string Path { get; set; }
        public int LaboratoryTestReportMedicalHistoryId { get; set; }
        public int LaboratoryTestReportLaboratoryTestId { get; set; }


    }
}
