using ClinicBooking.Models.DTOs;

namespace ClinicBooking.Services.IServices;

public interface IMedicalHistoryService
{
    Task<IEnumerable<MedicalHistoryDTO>> GetAll();
    Task<MedicalHistoryDTO> GetById(int id);
    Task<MedicalHistoryDTO> Create(MedicalHistoryRequest request);
    Task<MedicalHistoryDTO> Update(int id, MedicalHistoryRequest request);
    Task<MedicalHistoryDTO> DeleteById(int id);

}