using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public interface ILaboratoryTestService
    {
        Task<PageResultUlt<IEnumerable<LaboratoryTestDTO>>> GetAll(int pageSize = 0, int pageNumber = 1);
        Task<LaboratoryTestDTO> GetById(int id);
        Task<LaboratoryTestDTO> Create(LaboratoryTestRequest request);
        Task<LaboratoryTestDTO> Update(int id, LaboratoryTestRequest laboratoryTestRequest);
        Task<LaboratoryTestDTO> DeleteById(int id);
    }
}