using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models
{
    public class Department: EntityBase
    {
        [Key]
        public int DepartmentID { get; set; }

        [Required, StringLength(100)]
        public string DepartmentName { get; set; }
    }
}
