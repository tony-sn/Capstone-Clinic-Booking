using ClinicBooking.Models;
using Microsoft.AspNetCore.Identity;

namespace ClinicBooking.Data
{
    public class DbInitializer
    {
        public static async Task SeedData(ApplicationDbContext context, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            if (!roleManager.Roles.Any())
            {
                var roles = new List<Role>
            {
                new() {Name = "User"},
                new() {Name = "Admin"},
                //new Role{Name = "Moderator"},
            };

                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }
            }
            if (!userManager.Users.Any())
            {
                var users = new List<User>
            {
                new() {FirstName = "Khuong", LastName = "Le Huu", UserName = "ilehuukhuong@gmail.com", Email = "ilehuukhuong@gmail.com", EmailConfirmed = true},
                new() {FirstName = "Admin", LastName = string.Empty, UserName = "admin@admin.com", Email = "admin@admin.com", EmailConfirmed = true}
            };

                foreach (var user in users)
                {
                    var result = await userManager.CreateAsync(user, "Pa$$w0rd");
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(user, "Admin");
                    }
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
