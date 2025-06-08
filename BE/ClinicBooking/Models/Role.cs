using Microsoft.AspNetCore.Identity;

namespace ClinicBooking.Models;

public class Role : IdentityRole<int>
{
    public ICollection<UserRole> UserRoles { get; set; } = [];
}
