using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;

namespace ClinicBooking.Services.IServices;

public interface IMedicalHistoryService
{
    Task<PageResultUlt<IEnumerable<MedicalHistoryDTO>>> GetAll(int pageSize = 0, int pageNumber = 1);
    Task<MedicalHistoryDTO> GetById(int id);
    Task<MedicalHistoryDTO> Create(MedicalHistoryRequest request);
    Task<MedicalHistoryDTO> Update(int id, MedicalHistoryRequest request);
    Task<MedicalHistoryDTO> DeleteById(int id);
    Task<MedicalHistoryDTO> CalculateTotalAmount(int medicalHistoryId);
}