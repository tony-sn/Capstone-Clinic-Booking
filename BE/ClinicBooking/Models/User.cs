using Microsoft.AspNetCore.Identity;

namespace ClinicBooking.Models;

public class User : IdentityUser<int>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public ICollection<UserRole> UserRoles { get; set; } = [];
}
