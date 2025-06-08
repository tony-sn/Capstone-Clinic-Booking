using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ClinicBooking.Data;
using ClinicBooking.Entities;
using Microsoft.AspNetCore.Identity;

namespace ClinicBooking.Entities
{
    public class AdminUser
    {
        [Key, Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        [NotMapped]
        public string Password { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? LastLoggedIn { get; set; }

        public ICollection<AdminUserClaim> AdminUserClaims { get; set; }
        public ICollection<AdminUserRole> AdminUserRoles { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; }
        public ICollection<AdminUserLog> AdminUserLogs { get; set; }
    }
}
