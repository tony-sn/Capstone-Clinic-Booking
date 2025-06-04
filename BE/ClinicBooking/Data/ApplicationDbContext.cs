using ClinicBooking.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<Appointment> Appointments { get; set; }
    }
}
