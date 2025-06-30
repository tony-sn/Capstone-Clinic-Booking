using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs;

public class DepartmentDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool Active { get; set; }
    public static DepartmentDTO ConvertToDTO(Department department)
    {
        return new DepartmentDTO
        {
            Id = department.DepartmentID,
            Name = department.DepartmentName,
            Active = department.Active
        };
    }
}
public class DepartmentRequest
{
    [Required]
    [MaxLength(200, ErrorMessage = "Tên không được vượt quá 200 ký tự.")]
    public string Name { get; set; } = string.Empty;
}