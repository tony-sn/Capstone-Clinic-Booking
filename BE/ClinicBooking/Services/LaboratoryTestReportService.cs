using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking.Services.IServices;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public class LaboratoryTestReportService : ILaboratoryTestReportService
    {
        private readonly ILaboratoryTestReportRepository _laboratoryTestReportRepository;
        public LaboratoryTestReportService(ILaboratoryTestReportRepository laboratoryTestReportRepository)
        {
            _laboratoryTestReportRepository = laboratoryTestReportRepository;
        }
        public async Task<LaboratoryTestReportDTO> CreateLaboratoryTestReportAsync(CreateLaboratoryTestReportRequest request)
        {
            var results = await _laboratoryTestReportRepository.CreateLaboratoryTestReportAsync(request);

            return LaboratoryTestReportDTO.ConvertToLaboratoryTestReportDTO(results);
        }

        public async Task<LaboratoryTestReportDTO> DeleteLaboratoryTestReportAsync(int medicalHistoryId, int laboratoryTestId)
        {
            var result = await _laboratoryTestReportRepository.DeleteLaboratoryTestReportAsync(medicalHistoryId, laboratoryTestId);
            return result != null ? LaboratoryTestReportDTO.ConvertToLaboratoryTestReportDTO(result) : null;
        }

        public async Task<PageResultUlt<IEnumerable<LaboratoryTestReportDTO>>> GetAllLaboratoryTestReportsAsync(LaboratoryTestReportFilter filter)
        {
            var results = await _laboratoryTestReportRepository.GetAllLaboratoryTestReportsAsync(filter);
            if (results == null) return new PageResultUlt<IEnumerable<LaboratoryTestReportDTO>>
            {
                Items = new List<LaboratoryTestReportDTO>(),
                TotalItems = 0,
            };

            return new PageResultUlt<IEnumerable<LaboratoryTestReportDTO>>
            {
                Items = results.Items.Select(x => LaboratoryTestReportDTO.ConvertToLaboratoryTestReportDTO(x)),
                TotalItems = results.TotalItems,
            };
        }

        public async Task<LaboratoryTestReportDTO> GetLaboratoryTestReportByIdAsync(int medicalHistoryId, int laboratoryTestId)
        {
            var result = await _laboratoryTestReportRepository.GetLaboratoryTestReportByIdAsync(medicalHistoryId, laboratoryTestId);

            return result != null ? LaboratoryTestReportDTO.ConvertToLaboratoryTestReportDTO(result) : null;
        }

        public async Task<LaboratoryTestReportDTO> UpdateLaboratoryTestReportAsync(UpdateLaboratoryTestReportRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request), "UpdateLaboratoryTestReportRequest cannot be null");
            }
            if (request.MedicalHistoryId <= 0)
            {
                throw new ArgumentException("MedicalHistoryId must be greater than zero", nameof(request.MedicalHistoryId));
            }
            if (request.LaboratoryTestId <= 0)
            {
                throw new ArgumentException("LaboratoryTestId must be greater than zero", nameof(request.LaboratoryTestId));
            }
            if (string.IsNullOrWhiteSpace(request.Result))
            {
                throw new ArgumentException("Result cannot be null or empty", nameof(request.Result));
            }
            if (request.TechnicianId <= 0)
            {
                throw new ArgumentException("TechnicianId must be greater than zero", nameof(request.TechnicianId));
            }
            var result = await _laboratoryTestReportRepository.UpdateLaboratoryTestReportAsync(request);
            return result != null ? LaboratoryTestReportDTO.ConvertToLaboratoryTestReportDTO(result) : null;
        }
    }
}