using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;

namespace ClinicBooking.Services.IServices
{
    public interface IPrescriptionDetailService
    {
        Task<PageResultUlt<IEnumerable<PrescriptionDetailDTO>>> GetAll(int pageSize = 0, int pageNumber = 1);
        Task<PageResultUlt<IEnumerable<PrescriptionDetailDTO>>> GetAllByPrescriptionId(int PrescriptionId, int pageSize = 0, int pageNumber = 1);
        Task<PrescriptionDetailDTO> GetById(int PrescriptionId, int MedicineId);
        Task<PrescriptionDetailDTO> Create(PrescriptionDetailRequest prescriptionDetailRequest);
        Task<PrescriptionDetailDTO> DeleteById(int PrescriptionId, int MedicineId);
        Task<PrescriptionDetailDTO> Update(int PrescriptionId, int MedicineId, PrescriptionDetailRequest prescriptionDetailRequest);
    }
}
