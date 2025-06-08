namespace ClinicBooking.Models
{
    public class Doctor : EntityBase
    {
        public int DepartmentID { get; set; }
        public Department Department { get; set; }
        public string Certificate { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }
    }
}
