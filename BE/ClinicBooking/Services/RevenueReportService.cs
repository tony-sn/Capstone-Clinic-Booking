using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public class RevenueReportService : IRevenueReportService
    {
        private readonly IRevenueReportRepository _repository;

        public RevenueReportService(IRevenueReportRepository repository)
        {
            _repository = repository;
        }

        public async Task<PageResultUlt<IEnumerable<RevenueReportDTO>>> GetAll(int pageNumber = 0, int pageSize = 1)
        {
            if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0) throw new ArgumentException($"inlvalid page number:{pageNumber}");
            var list = await _repository.GetAllAsync();
            if (list == null) return null;
            var totalItems = list.Count();
            if (pageSize > 0)
            {
                list = list.Skip((1 - pageNumber) * pageSize).Take(pageSize).ToList();
            }

            return new PageResultUlt<IEnumerable<RevenueReportDTO>>
            {
                Items = list.Select(x => RevenueReportDTO.ConvertToDTO(x)),
                TotalItems = totalItems
            };
        }

        public async Task<RevenueReportDTO> GetById(int id)
        {
            var item = await _repository.GetById(id);
            return item == null ? null : RevenueReportDTO.ConvertToDTO(item);
        }

        public async Task<RevenueReportDTO> Create(RevenueReportRequest report)
        {
            var entity = new RevenueReport
            {
                RevenueType = report.RevenueType,
                FromDate = report.FromDate,
                ToDate = report.ToDate,
                RevenueAmount = report.RevenueAmount
            };
            var created = await _repository.Create(entity);
            return RevenueReportDTO.ConvertToDTO(created);
        }

        public async Task<RevenueReportDTO> Update(int id, RevenueReportRequest report)
        {
            var entity = new RevenueReport
            {
                RevenueReportID = id,
                RevenueType = report.RevenueType,
                FromDate = report.FromDate,
                ToDate = report.ToDate,
                RevenueAmount = report.RevenueAmount
            };
            var updated = await _repository.Update(id, entity);
            return RevenueReportDTO.ConvertToDTO(updated);
        }

        public async Task<RevenueReportDTO> DeleteById(int id)
        {
            var deleted = await _repository.DeleteById(id);
            return RevenueReportDTO.ConvertToDTO(deleted);
        }
    }
}