using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public interface IRevenueReportService
    {
        Task<PageResultUlt<IEnumerable<RevenueReportDTO>>> GetAll(int pageSize = 0, int pageNumber = 1);
        Task<RevenueReportDTO> GetById(int id);
        Task<RevenueReportDTO> Create(RevenueReportRequest report);
        Task<RevenueReportDTO> Update(int id, RevenueReportRequest report);
        Task<RevenueReportDTO> DeleteById(int id);
        Task<PageResultUlt<IEnumerable<RevenueReportDTO>>> FilterByType(RevenueType type, int pageSize, int pageNumber);
    }
}