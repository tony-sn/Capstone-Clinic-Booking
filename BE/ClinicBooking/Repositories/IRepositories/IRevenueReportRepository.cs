using ClinicBooking.Models;
namespace ClinicBooking.Repositories.IRepositories
{
    public interface IRevenueReportRepository
    {
        Task<IEnumerable<RevenueReport>> GetAllAsync();
        Task<RevenueReport?> GetById(int id);
        Task<RevenueReport> Create(RevenueReport report);
        Task<RevenueReport> Update(int id, RevenueReport report);
        Task<RevenueReport> DeleteById(int id);
    }
}