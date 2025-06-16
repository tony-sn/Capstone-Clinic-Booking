using ClinicBooking_Utility;
using ClinicBooking.Models.DTOs;

namespace ClinicBooking.Services.IServices;

public interface IMedicalHistoryService
{
    Task<PageResultUlt<IEnumerable<MedicalHistoryDTO>>> GetAll(int pageSize = 0, int pageNumber = 1);
    Task<MedicalHistoryDTO> GetById(int id);
    Task<MedicalHistoryDTO> Create(MedicalHistoryRequest request);
    Task<MedicalHistoryDTO> Update(int id, MedicalHistoryRequest request);
    Task<MedicalHistoryDTO> DeleteById(int id);

}