using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking.Services.IServices;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public class PrescriptionDetailService : IPrescriptionDetailService
    {
        private readonly IPrescriptionDetailRepositiory _prescriptionDetailRepositiory;
        public PrescriptionDetailService(IPrescriptionDetailRepositiory prescriptionDetailRepositiory)
        {
            _prescriptionDetailRepositiory = prescriptionDetailRepositiory;
        }

        public async Task<PrescriptionDetailDTO> Create(PrescriptionDetailRequest prescriptionDetailRequest)
        {
            var item = new PrescriptionDetail
            {
                PrescriptionID = prescriptionDetailRequest.PrescriptionID,
                MedicineID = prescriptionDetailRequest.MedicineID,
                Quantity = prescriptionDetailRequest.Quantity,
                Usage = prescriptionDetailRequest.Usage,
            };
            var result = await _prescriptionDetailRepositiory.Create(item);
            if (result == null) throw new ArgumentException($"invalid create request");
            return PrescriptionDetailDTO.ConvertToDTO(result);
        }

        public async Task<PrescriptionDetailDTO> DeleteById(int PrescriptionId, int MedicineId)
        {
            var result = await _prescriptionDetailRepositiory.DeleteById(PrescriptionId, MedicineId);
            return PrescriptionDetailDTO.ConvertToDTO(result);
        }

        public async Task<PageResultUlt<IEnumerable<PrescriptionDetailDTO>>> GetAll(int pageSize = 0, int pageNumber = 1)
        {
            if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0) throw new ArgumentException($"inlvalid page number:{pageNumber}");

            var PrescriptionDetailList = await _prescriptionDetailRepositiory.GetAllAsync();
            if (PrescriptionDetailList == null) return null;

            var totalItems = PrescriptionDetailList.Count();
            if (pageSize > 0)
            {
                PrescriptionDetailList = PrescriptionDetailList.Skip((1 - pageNumber) * pageSize).Take(pageSize).ToList();
            }
            return new PageResultUlt<IEnumerable<PrescriptionDetailDTO>>
            {
                Items = PrescriptionDetailList.Select(x => PrescriptionDetailDTO.ConvertToDTO(x)),
                TotalItems = totalItems
            };
        }

        public async Task<PageResultUlt<IEnumerable<PrescriptionDetailDTO>>> GetAllByPrescriptionId(int PrescriptionId, int pageSize = 0, int pageNumber = 1)
        {
            if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0) throw new ArgumentException($"inlvalid page number:{pageNumber}");

            var PrescriptionDetailList = await _prescriptionDetailRepositiory.GetAllByPrescriptionIdAsync(PrescriptionId);
            if (PrescriptionDetailList == null) return null;

            var totalItems = PrescriptionDetailList.Count();
            if (pageSize > 0)
            {
                PrescriptionDetailList = PrescriptionDetailList.Skip((1 - pageNumber) * pageSize).Take(pageSize).ToList();
            }
            return new PageResultUlt<IEnumerable<PrescriptionDetailDTO>>
            {
                Items = PrescriptionDetailList.Select(x => PrescriptionDetailDTO.ConvertToDTO(x)),
                TotalItems = totalItems
            };
        }

        public  async Task<PrescriptionDetailDTO> GetById(int PrescriptionId, int MedicineId)
        {
            var item = await _prescriptionDetailRepositiory.GetById(PrescriptionId, MedicineId);
            if (item == null) throw new ArgumentException($"invalid PrescriptionId: {PrescriptionId}, MedicineId: {MedicineId}");
            return PrescriptionDetailDTO.ConvertToDTO(item);
        }

        public async Task<PrescriptionDetailDTO> Update(int PrescriptionId, int MedicineId, PrescriptionDetailRequest prescriptionDetailRequest)
        {
            var item = new PrescriptionDetail
            {
                Quantity = prescriptionDetailRequest.Quantity,
                Usage = prescriptionDetailRequest.Usage
            };

            var result = await _prescriptionDetailRepositiory.Update(PrescriptionId, MedicineId, item);
            return PrescriptionDetailDTO.ConvertToDTO(result);
        }
    }
}
