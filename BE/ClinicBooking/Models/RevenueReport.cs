using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models
{
    public class RevenueReport : EntityBase
    {
        [Key]
        public int RevenueReportID { get; set; }
        public ICollection<Transaction> Transaction { get; set; }

        [Required]
        public RevenueType RevenueType { get; set; }

        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal RevenueAmount { get; set; }
    }

    public enum RevenueType
    {
        Monthly,
        WeekLy,
        Quartertly,
        Yearly
    }
}
