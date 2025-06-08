namespace ClinicBooking.Entities
{
  public class RefreshToken
  {
    public int ID { get; set; }
    public string Token { get; set; }
    public string JwtId { get; set; }
    public DateTimeOffset CreationDate { get; set; }
    public DateTimeOffset ExpiryDate { get; set; }
    public bool Used { get; set; }
    public bool Invalidated { get; set; } = false;
    public int UserID { get; set; }
    // TODO: add User Entities here

  }
}