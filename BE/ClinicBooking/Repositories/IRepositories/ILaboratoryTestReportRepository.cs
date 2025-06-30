using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;

namespace ClinicBooking.Repositories.IRepositories
{
    public interface ILaboratoryTestReportRepository
    {
        Task<LaboratoryTestReport> CreateLaboratoryTestReportAsync(CreateLaboratoryTestReportRequest request);
        Task<LaboratoryTestReport> UpdateLaboratoryTestReportAsync(UpdateLaboratoryTestReportRequest request);
        Task<LaboratoryTestReport> DeleteLaboratoryTestReportAsync(int medicalHistoryId, int laboratoryTestId);
        Task<LaboratoryTestReport> GetLaboratoryTestReportByIdAsync(int medicalHistoryId, int laboratoryTestId);
        Task<PageResultUlt<IEnumerable<LaboratoryTestReport>>> GetAllLaboratoryTestReportsAsync(LaboratoryTestReportFilter filter);
    }


}