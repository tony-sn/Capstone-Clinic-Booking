namespace ClinicBooking.Models
{
    public class AuthToken
    {
        public string Token { get; set; }
        public DateTimeOffset Expiration { get; set; }
        public string RefreshToken { get; set; }
        public DateTimeOffset RefreshTokenExpires { get; set; }
        public string Name { get; set; }
    }
}
