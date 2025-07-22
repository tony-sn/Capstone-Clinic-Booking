using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;

namespace ClinicBooking.Services.IServices
{
    public interface IPrescriptionService
    {
        Task<PageResultUlt<IEnumerable<PrescriptionDTO>>> GetAll(int pageSize = 0, int pageNumber = 1);
        Task<PageResultUlt<IEnumerable<PrescriptionDTO>>> GetAllByMedicalHistoryId(int id, int pageSize = 0, int pageNumber = 1);
        Task<PrescriptionDTO> GetById(int id);
        Task<PrescriptionDTO> Create(PrescriptionRequest prescriptionRequest);
        Task<PrescriptionDTO> UpdateTotalAmountAsync(int prescriptionId, PrescriptionRequest request);
        Task<PrescriptionDTO> DeleteById(int id);
    }
}
