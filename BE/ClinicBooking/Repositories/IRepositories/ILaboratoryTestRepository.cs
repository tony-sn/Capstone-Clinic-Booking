using System.Security.Principal;
using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;

namespace ClinicBooking.Repositories.IRepositories
{


    public interface ILaboratoryTestRepository
    {
        Task<IEnumerable<LaboratoryTest>> GetAllLaboratoryTestsAsync();
        Task<LaboratoryTest> GetById(int id);

        Task<LaboratoryTest> Create(LaboratoryTest laboratoryTest);
        Task<LaboratoryTest> Update(int id, LaboratoryTest laboratoryTest);
        Task<LaboratoryTest> DeleteById(int id);
    }
}