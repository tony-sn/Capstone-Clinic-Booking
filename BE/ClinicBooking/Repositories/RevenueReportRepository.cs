using ClinicBooking.Data;
using ClinicBooking.Models;
using ClinicBooking.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Repositories
{
    public class RevenueReportRepository : IRevenueReportRepository
    {
        private readonly ApplicationDbContext _context;
        public RevenueReportRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RevenueReport>> GetAllAsync()
        {
            return await _context.RevenueReports.ToListAsync();
        }

        public async Task<RevenueReport?> GetById(int id)
        {
            return await _context.RevenueReports.FindAsync(id);
        }

        public async Task<RevenueReport> Create(RevenueReport report)
        {
            await _context.RevenueReports.AddAsync(report);
            await _context.SaveChangesAsync();
            return report;
        }

        public async Task<RevenueReport> Update(int id, RevenueReport report)
        {
            if (id != report.RevenueReportID)
                throw new ArgumentException($"invalid id: {id}");
            _context.RevenueReports.Update(report);
            await _context.SaveChangesAsync();
            return report;
        }

        public async Task<RevenueReport> DeleteById(int id)
        {
            var item = await _context.RevenueReports.FindAsync(id);
            if (item == null) throw new ArgumentException($"invalid id: {id}");
            _context.RevenueReports.Remove(item);
            await _context.SaveChangesAsync();
            return item;
        }
    }
}