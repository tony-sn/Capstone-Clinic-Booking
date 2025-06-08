using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.ViewModels
{
  public class LoginRequestViewModel
  {
    [Required, DataType(DataType.EmailAddress)]
    public string Email { get; set; }
    [Required, DataType(DataType.Password)]
    public string Password { get; set; }
  }
}