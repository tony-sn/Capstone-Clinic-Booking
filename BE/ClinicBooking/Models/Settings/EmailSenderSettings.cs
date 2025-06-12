namespace ClinicBooking.Models.Settings
{
    public class EmailSenderSettings
    {
        public string SmtpServer { get; set; } = string.Empty;
        public int SmtpPort { get; set; }
        public bool EnableSsl { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = "fspfqkkxmdljldyy";
    }
}
