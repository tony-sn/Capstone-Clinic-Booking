using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking.Services.IServices;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public class MedicineInventoryEntryService : IMedicineInventoryEntryService
    {
        private readonly IMedicineInventoryEntryRepository _medicineInventoryEntryRepository;
        public MedicineInventoryEntryService(IMedicineInventoryEntryRepository medicineInventoryEntryRepository)
        {
            _medicineInventoryEntryRepository = medicineInventoryEntryRepository;
        }
        public async Task<MedicineInventoryEntryDTO> Create(MedicineInventoryEntryRequest request)
        {
            var item = new MedicineInventoryEntry
            {
                MedicineID = request.MedicineID,
                ChangeType = request.ChangeType,
                CompanyName = request.CompanyName,
                Quantity = request.Quantity,
                Note = request.Note,
                PrescriptionID = request.PrescriptionID,
            };

            var result = await _medicineInventoryEntryRepository.Create(item);
            if (result == null) throw new ArgumentException($"invalid create request");
            return MedicineInventoryEntryDTO.ConvertToDTO(result);
        }

        public async Task<MedicineInventoryEntryDTO> DeleteById(int id)
        {
            var result = await _medicineInventoryEntryRepository.DeleteById(id);
            return MedicineInventoryEntryDTO.ConvertToDTO(result);
        }

        public async Task<PageResultUlt<IEnumerable<MedicineInventoryEntryDTO>>> GetAll(int pageSize = 0, int pageNumber = 1)
        {
            if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0) throw new ArgumentException($"inlvalid page number:{pageNumber}");

            var itemList = await _medicineInventoryEntryRepository.GetAllAsync();
            if (itemList == null) return null;

            var totalItems = itemList.Count();
            if (pageSize > 0)
            {
                itemList = itemList.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }
            return new PageResultUlt<IEnumerable<MedicineInventoryEntryDTO>>
            {
                Items = itemList.Select(x => MedicineInventoryEntryDTO.ConvertToDTO(x)),
                TotalItems = totalItems
            };
        }

        public async Task<MedicineInventoryEntryDTO> GetById(int id)
        {
            var item = await _medicineInventoryEntryRepository.GetByIdAsync(id);
            if (item == null) throw new ArgumentException($"invalid Id:{id}");
            return MedicineInventoryEntryDTO.ConvertToDTO(item);
        }

        public async Task<MedicineInventoryEntryDTO> Update(int id, MedicineInventoryEntryRequest medicineInventoryEntryRequest)
        {
            var item = new MedicineInventoryEntry
            {
                MedicineID = medicineInventoryEntryRequest.MedicineID,
                ChangeType = medicineInventoryEntryRequest.ChangeType,
                CompanyName = medicineInventoryEntryRequest.CompanyName,
                Quantity = medicineInventoryEntryRequest.Quantity,
                Note = medicineInventoryEntryRequest.Note,
                PrescriptionID = medicineInventoryEntryRequest.PrescriptionID
            };

            var result = await _medicineInventoryEntryRepository.UpdateById(id, item);
            return MedicineInventoryEntryDTO.ConvertToDTO(result);
        }
    }
}
