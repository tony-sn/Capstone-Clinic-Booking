using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs
{
    public class ImageDTO
    {
        public int ImageID { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public string Path { get; set; }

        public static ImageDTO ConvertToImageDTO(Image image)
        {
            return new ImageDTO
            {
                ImageID = image.ImageID,
                FileName = image.FileName,
                FileExtension = image.FileExtension,
                Path = image.Path
            };
        }
    }
    public class CreateImageRequest

    {
        [Required]
        public IFormFile File { get; set; }
        [Required]
        public int LaboratoryTestReportLaboratoryTestId { get; set; }
        [Required]
        public int LaboratoryTestReportMedicalHistoryId { get; set; }
    }
    public class UpdateImageRequest
    {
        public IFormFile File { get; set; }
        [Required]
        public int LaboratoryTestReportLaboratoryTestId { get; set; }
        [Required]
        public int LaboratoryTestReportMedicalHistoryId { get; set; }
    }
}