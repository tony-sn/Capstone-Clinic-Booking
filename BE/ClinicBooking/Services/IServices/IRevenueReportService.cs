using ClinicBooking.Models.DTOs;

namespace ClinicBooking.Services
{
    public interface IRevenueReportService
    {
        Task<IEnumerable<RevenueReportDTO>> GetAll();
        Task<RevenueReportDTO> GetById(int id);
        Task<RevenueReportDTO> Create(RevenueReportRequest report);
        Task<RevenueReportDTO> Update(int id, RevenueReportRequest report);
        Task<RevenueReportDTO> DeleteById(int id);
    }
}