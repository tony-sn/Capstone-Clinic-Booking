using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking.Services.IServices;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public class MedicineService : IMedicineService
    {
        private readonly IMedicineRepository _medicineRepository;
        public MedicineService(IMedicineRepository medicineRepository)
        {
            _medicineRepository = medicineRepository;
        }

        public async Task<MedicineDTO> Create(MedicineRequest request)
        {
            var medicine = new Medicine
            {
                MedicineName = request.MedicineName,
                Description = request.Description,
                UnitPrice = request.UnitPrice,
                Quantity = request.Quantity
            };
            var result = await _medicineRepository.Create(medicine);
            if (result == null) throw new ArgumentException($"invalid create request");
            return MedicineDTO.ConvertToDTO(result);
        }

        public async Task<MedicineDTO> DeleteById(int id)
        {
            var result = await _medicineRepository.DeleteById(id);
            return MedicineDTO.ConvertToDTO(result);
        }

        public async Task<PageResultUlt<IEnumerable<MedicineDTO>>> GetAll(int pageSize = 0, int pageNumber = 1)
        {
            if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0) throw new ArgumentException($"inlvalid page number:{pageNumber}");
            
            var medicineList = await _medicineRepository.GetAllAsync();
            if (medicineList == null) return null;

            var totalItems = medicineList.Count();
            if (pageSize > 0) 
            {
                medicineList = medicineList.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }
            return new PageResultUlt<IEnumerable<MedicineDTO>>
            {
                Items = medicineList.Select(x => MedicineDTO.ConvertToDTO(x)),
                TotalItems = totalItems
            };
        }

        public async Task<MedicineDTO> GetById(int id)
        {
            var item = await _medicineRepository.GetByIdAsync(id);
            if (item == null) throw new ArgumentException($"invalid Id:{id}");
            return MedicineDTO.ConvertToDTO(item);
        }

        public async Task<MedicineDTO> Update(int id, MedicineRequest medicineRequest)
        {
            var item = new Medicine
            {
                MedicineName = medicineRequest.MedicineName,
                Description = medicineRequest.Description,
                Quantity = medicineRequest.Quantity,
                UnitPrice = medicineRequest.UnitPrice
            };

            var result = await _medicineRepository.UpdateById(id, item);
            return MedicineDTO.ConvertToDTO(result);
        }
    }
}
