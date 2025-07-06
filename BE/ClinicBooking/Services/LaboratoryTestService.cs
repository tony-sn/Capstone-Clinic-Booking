using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public class LaboratoryTestService : ILaboratoryTestService
    {
        private readonly ILaboratoryTestRepository _laboratoryTestRepository;
        public LaboratoryTestService(ILaboratoryTestRepository laboratoryTestRepository)
        {
            _laboratoryTestRepository = laboratoryTestRepository;
        }

        public async Task<LaboratoryTestDTO> Create(LaboratoryTestRequest request)
        {
            var laboratoryTest = new LaboratoryTest
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price
            };
            var result = await _laboratoryTestRepository.Create(laboratoryTest);
            if (result == null) throw new ArgumentException($"invalid create request");
            return LaboratoryTestDTO.ConvertToDTO(result);
        }

        public async Task<LaboratoryTestDTO> DeleteById(int id)
        {
            var result = await _laboratoryTestRepository.DeleteById(id);
            return LaboratoryTestDTO.ConvertToDTO(result);
        }

        public async Task<PageResultUlt<IEnumerable<LaboratoryTestDTO>>> GetAll(int pageSize = 0, int pageNumber = 1)
        {
            if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0) throw new ArgumentException($"inlvalid page number:{pageNumber}");
            var laboratoryTestList = await _laboratoryTestRepository.GetAllLaboratoryTestsAsync();
            if (laboratoryTestList == null) return null;
            var totalItems = laboratoryTestList.Count();
            if (pageSize > 0)
            {
                laboratoryTestList = laboratoryTestList.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }
            return new PageResultUlt<IEnumerable<LaboratoryTestDTO>>
            {
                Items = laboratoryTestList.Select(x => LaboratoryTestDTO.ConvertToDTO(x)),
                TotalItems = totalItems
            };
        }

        public async Task<LaboratoryTestDTO> GetById(int id)
        {
            var item = await _laboratoryTestRepository.GetById(id);
            if (item == null) throw new ArgumentException($"invalid Id:{id}");
            return LaboratoryTestDTO.ConvertToDTO(item);
        }

        public async Task<LaboratoryTestDTO> Update(int id, LaboratoryTestRequest laboratoryTestRequest)
        {
            var item = new LaboratoryTest
            {
                Name = laboratoryTestRequest.Name,
                Description = laboratoryTestRequest.Description,
                Price = laboratoryTestRequest.Price,
                Active = laboratoryTestRequest.Active
            };
            var result = await _laboratoryTestRepository.Update(id, item);
            return LaboratoryTestDTO.ConvertToDTO(result);
        }
    }
}
