using ClinicBooking.Models;

namespace ClinicBooking.Repositories.IRepositories
{
    public interface IPrescriptionDetailRepositiory
    {
        Task<IEnumerable<PrescriptionDetail>> GetAllAsync();
        Task<IEnumerable<PrescriptionDetail>> GetAllByPrescriptionIdAsync(int id);
        Task<PrescriptionDetail> GetById(int PrescriptionId, int MedicineId);

        Task<PrescriptionDetail> Create(PrescriptionDetail prescriptionDetail);
        Task<PrescriptionDetail> Update(int PrescriptionId, int MedicineId, PrescriptionDetail prescriptionDetail);
        Task<PrescriptionDetail> DeleteById(int PrescriptionId, int MedicineId);
    }
}
