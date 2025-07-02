using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs;

public class DoctorDTO
{
    public int Id { get; set; }
    public int DepartmentID { get; set; }
    public DepartmentDTO Department { get; set; }
    public string Certificate { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool Active { get; set; }
    public static DoctorDTO ConvertToDTO(Doctor doctor)
    {
        return new DoctorDTO
        {
            Id = doctor.Id,
            UserId = doctor.UserId,
            FirstName = doctor.User.FirstName,
            LastName = doctor.User.LastName,
            Certificate = doctor.Certificate,
            DepartmentID = doctor.DepartmentID,
            Department = DepartmentDTO.ConvertToDTO(doctor.Department),
            Active = doctor.Active
        };
    }
}
public class DoctorRequest
{
    [Required]
    public int DepartmentID { get; set; }
    [Required]
    public string Certificate { get; set; } = string.Empty;
    [Required]
    public int UserId { get; set; }
}