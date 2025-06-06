using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models
{
    public class LaboratoryTest: EntityBase
    {
        [Key]
        public int LaboratoryTestId { get; set; }

        [Required, StringLength(200)]
        public string Name { get; set; }

        public string Description { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
    }
}
