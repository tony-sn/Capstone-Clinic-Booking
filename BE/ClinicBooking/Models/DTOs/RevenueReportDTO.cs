using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs;

public class RevenueReportDTO
{
    public int Id { get; set; }
    public RevenueType RevenueType { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public decimal RevenueAmount { get; set; }
    public bool Active { get; set; }

    public static RevenueReportDTO ConvertToDTO(RevenueReport report)
    {
        return new RevenueReportDTO
        {
            Id = report.RevenueReportID,
            RevenueType = report.RevenueType,
            FromDate = report.FromDate,
            ToDate = report.ToDate,
            RevenueAmount = report.RevenueAmount,
            Active = report.Active,
        };
    }
}

public class RevenueReportRequest
{
    [Required] public RevenueType RevenueType { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    [Range(0, double.MaxValue)] public decimal RevenueAmount { get; set; }
}