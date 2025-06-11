namespace ClinicBooking.Services.IServices
{
    using ClinicBooking.Models.DTOs;
    using ClinicBooking_Utility;

    public interface ILaboratoryTestReportService
    {
        Task<LaboratoryTestReportDTO> CreateLaboratoryTestReportAsync(CreateLaboratoryTestReportRequest request);
        Task<LaboratoryTestReportDTO> UpdateLaboratoryTestReportAsync(UpdateLaboratoryTestReportRequest request);
        Task<LaboratoryTestReportDTO> DeleteLaboratoryTestReportAsync(int medicalHistoryId, int laboratoryTestId);
        Task<LaboratoryTestReportDTO> GetLaboratoryTestReportByIdAsync(int medicalHistoryId, int laboratoryTestId);
        Task<PageResultUlt<IEnumerable<LaboratoryTestReportDTO>>> GetAllLaboratoryTestReportsAsync(LaboratoryTestReportFilter filter);
    }
}