using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs
{
    public class LaboratoryTestDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool Active { get; set; }
        public static LaboratoryTestDTO ConvertToDTO(LaboratoryTest laboratoryTest)
        {
            return new LaboratoryTestDTO
            {
                Id = laboratoryTest.LaboratoryTestId,
                Name = laboratoryTest.Name,
                Description = laboratoryTest.Description,
                Price = laboratoryTest.Price,
                Active = laboratoryTest.Active
            };
        }
    }
    public class LaboratoryTestRequest
    {
        [Required]
        [MaxLength(200, ErrorMessage = "Tên xét nghiệm không được vượt quá 200 ký tự.")]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
    }
}
