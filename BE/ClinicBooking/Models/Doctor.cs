namespace ClinicBooking.Models
{
    public class Doctor : User
    {
        public int DepartmentID { get; set; }
        public Department Department { get; set; }
        public string Certificate { get; set; }
    }
}
