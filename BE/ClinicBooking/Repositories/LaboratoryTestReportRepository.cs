using ClinicBooking.Data;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking_Utility;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Models.DTOs
{
    public class LaboratoryTestReportRepository : ILaboratoryTestReportRepository
    {
        private readonly ApplicationDbContext _context;
        public LaboratoryTestReportRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<LaboratoryTestReport> CreateLaboratoryTestReportAsync(CreateLaboratoryTestReportRequest request)
        {
            try
            {
                var technician = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.TechnicianId);
                if (technician == null)
                {
                    throw new ArgumentException($"invalid technician id: {request.TechnicianId}");
                }

                var existingMedicalHistory = await _context.MedicalHistories.AsNoTracking().FirstOrDefaultAsync(x => x.MedicalHistoryId == request.MedicalHistoryId);
                if (existingMedicalHistory == null)
                {
                    throw new ArgumentException($"Medical history not found with the given ID: {request.MedicalHistoryId}.");
                }

                var existingLaboratoryTest = await _context.LaboratoryTests.AsNoTracking().FirstOrDefaultAsync(x => x.LaboratoryTestId == request.LaboratoryTestId);
                if (existingLaboratoryTest == null)
                {
                    throw new ArgumentException($"Laboratory test not found with the given ID: {request.LaboratoryTestId}.");
                }
                _context.ChangeTracker.Clear(); // Clear the change tracker to avoid tracking issues
                _context.Attach(technician);
                var item = new LaboratoryTestReport
                {
                    MedicalHistoryId = request.MedicalHistoryId,
                    LaboratoryTestId = request.LaboratoryTestId,
                    Result = request.Result,
                    TechnicianId = request.TechnicianId,
                    Active = true
                };
                await _context.LaboratoryTestReports.AddAsync(item);
                await _context.SaveChangesAsync();
                return item;

            }
            catch (Exception ex)
            {
                throw;
            }

        }

        public async Task<LaboratoryTestReport> DeleteLaboratoryTestReportAsync(int medicalHistoryId, int laboratoryTestId)
        {

            var item = await _context.LaboratoryTestReports.AsNoTracking().FirstOrDefaultAsync(x => x.MedicalHistoryId == medicalHistoryId && x.LaboratoryTestId == laboratoryTestId);
            if (item == null)
            {
                throw new ArgumentException($"Laboratory test report not found with the given medical historyID {medicalHistoryId} and laboratory test ID: {laboratoryTestId}.");
            }
            item.Active = false;
            _context.LaboratoryTestReports.Update(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<PageResultUlt<IEnumerable<LaboratoryTestReport>>> GetAllLaboratoryTestReportsAsync(LaboratoryTestReportFilter filter)
        {
            var query = _context.LaboratoryTestReports.AsQueryable();
            var totalCount = await query.CountAsync();
            var results = await query.ToListAsync();
            if (filter.PageSize > 0) results = results.Skip((1 - filter.PageNumber) * filter.PageSize).Take(filter.PageSize).ToList();
            if (!string.IsNullOrEmpty(filter.Result))
                results = results.Where(x => x.Result.Contains(filter.Result.Trim(), StringComparison.OrdinalIgnoreCase)).ToList();
            foreach (var item in results)
            {
                var technician = await _context.Users.FirstOrDefaultAsync(x => x.Id == item.TechnicianId);
                item.Technician = technician;

            }
            return new PageResultUlt<IEnumerable<LaboratoryTestReport>>
            {
                Items = results,
                TotalItems = totalCount
            };

        }

        public async Task<LaboratoryTestReport> GetLaboratoryTestReportByIdAsync(int medicalHistoryId, int laboratoryTestId)
        {
            var item = await _context.LaboratoryTestReports.FirstOrDefaultAsync(x => x.MedicalHistoryId == medicalHistoryId && x.LaboratoryTestId == laboratoryTestId);
            if (item == null)
            {
                throw new ArgumentException($"Laboratory test report not found with the given medical historyID {medicalHistoryId} and laboratory test ID: {laboratoryTestId}.");
            }
            var technician = await _context.Users.FirstOrDefaultAsync(x => x.Id == item.TechnicianId);
            if (technician == null)
            {
                throw new ArgumentException($"Technician not found with the given technician ID: {item.TechnicianId}.");
            }
            item.Technician = technician;
            return item;
        }

        public async Task<LaboratoryTestReport> UpdateLaboratoryTestReportAsync(UpdateLaboratoryTestReportRequest request)
        {
            try
            {
                var technician = await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.TechnicianId);
                if (technician == null)
                {
                    throw new ArgumentException($"invalid technician id: {request.TechnicianId}");
                }
                var item = _context.LaboratoryTestReports.FirstOrDefault(x => x.MedicalHistoryId == request.MedicalHistoryId && x.LaboratoryTestId == request.LaboratoryTestId);
                if (item == null)
                {
                    throw new ArgumentException($"Laboratory test report not found with the given medical historyID {request.MedicalHistoryId} and laboratory test ID: {request.LaboratoryTestId}.");
                }
                item.Result = request.Result;
                item.Technician = technician;
                item.Active = request.Status;
                _context.LaboratoryTestReports.Update(item);
                await _context.SaveChangesAsync();
                return item;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
    }

}