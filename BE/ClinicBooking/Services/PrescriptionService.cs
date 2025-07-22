using Azure.Core;
using ClinicBooking_Utility;
using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories;
using ClinicBooking.Repositories.IRepositories;

namespace ClinicBooking.Services.IServices
{
    public class PrescriptionService : IPrescriptionService
    {
        private readonly IPrescriptionRepository _prescriptionRepository;

        public PrescriptionService(IPrescriptionRepository prescriptionRepository)
        {
            _prescriptionRepository = prescriptionRepository;
        }

        public async Task<PrescriptionDTO> Create(PrescriptionRequest prescriptionRequest)
        {
            var item = new Prescription
            {
                MedicalHistoryID = prescriptionRequest.MedicalHistoryID,
                TotalAmount = prescriptionRequest.TotalAmount,
            };
            var result = await _prescriptionRepository.Create(item);
            if (result == null)
                throw new ArgumentException($"invalid create request");
            return PrescriptionDTO.ConvertToDTO(result);
        }

        public async Task<PrescriptionDTO> DeleteById(int id)
        {
            var result = await _prescriptionRepository.DeleteById(id);
            return PrescriptionDTO.ConvertToDTO(result);
        }

        public async Task<PageResultUlt<IEnumerable<PrescriptionDTO>>> GetAll(
            int pageSize = 0,
            int pageNumber = 1
        )
        {
            if (pageSize < 0)
                throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0)
                throw new ArgumentException($"inlvalid page number:{pageNumber}");

            var prescriptionList = await _prescriptionRepository.GetAllAsync();
            if (prescriptionList == null)
                return null;

            var totalItems = prescriptionList.Count();
            if (pageSize > 0)
            {
                prescriptionList = prescriptionList
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
            }
            return new PageResultUlt<IEnumerable<PrescriptionDTO>>
            {
                Items = prescriptionList.Select(x => PrescriptionDTO.ConvertToDTO(x)),
                TotalItems = totalItems,
            };
        }

        public async Task<PageResultUlt<IEnumerable<PrescriptionDTO>>> GetAllByMedicalHistoryId(
            int id,
            int pageSize = 0,
            int pageNumber = 1
        )
        {
            if (pageSize < 0)
                throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0)
                throw new ArgumentException($"inlvalid page number:{pageNumber}");

            var prescriptionList = await _prescriptionRepository.GetAllByMedicalHistoryIdAsync(id);
            if (prescriptionList == null)
                return null;

            var totalItems = prescriptionList.Count();
            if (pageSize > 0)
            {
                prescriptionList = prescriptionList
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
            }
            return new PageResultUlt<IEnumerable<PrescriptionDTO>>
            {
                Items = prescriptionList.Select(x => PrescriptionDTO.ConvertToDTO(x)),
                TotalItems = totalItems,
            };
        }

        public async Task<PrescriptionDTO> GetById(int id)
        {
            var item = await _prescriptionRepository.GetById(id);
            if (item == null)
                throw new ArgumentException($"invalid Id:{id}");
            return PrescriptionDTO.ConvertToDTO(item);
        }

        public async Task<PrescriptionDTO> UpdateTotalAmountAsync(
            int prescriptionId,
            PrescriptionRequest request
        )
        {
            var entity = new Prescription
            {
                PrescriptionID = prescriptionId,
                MedicalHistoryID = request.MedicalHistoryID,
                TotalAmount = request.TotalAmount
            };

          var updatedEntity = await _prescriptionRepository.Update(prescriptionId, entity);


          return PrescriptionDTO.ConvertToDTO(updatedEntity);
        }
    }
}
