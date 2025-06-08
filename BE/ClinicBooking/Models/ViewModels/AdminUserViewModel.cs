using System.ComponentModel.DataAnnotations;
using ClinicBooking.Entities;

namespace ClinicBooking.Models.ViewModels
{
    public class AdminUserViewModel
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }

        public AdminUserViewModel(AdminUser au)
        {
            ID = au.ID;
            FirstName = au.FirstName;
            LastName = au.LastName;
            Email = au.Email;
            IsActive = au.IsActive;
        }
    }

    public class AdminUserCreateModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        [Required, DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required, DataType(DataType.Password)]
        public string Password { get; set; }
        public bool IsActive { get; set; } = true;

        public AdminUser AdminUser()
        {
            return new AdminUser
            {
                FirstName = FirstName,
                LastName = LastName,
                Email = Email,
                Password = Password,
                IsActive = IsActive,
            };
        }

        public bool ValidatePassword()
        {
            var valid = true;
            if (Password == null)
                valid = false;
            if (Password.Length < 6)
                valid = false;
            if (Password.IndexOfAny("abcdefghijklmnopqrstuvwxyz".ToCharArray()) == -1)
                valid = false;
            if (Password.IndexOfAny("0123456789".ToCharArray()) == -1)
                valid = false;

            return valid;
        }
    }

    public class AdminUserEditModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
    }
}
