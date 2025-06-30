using ClinicBooking.Data;
using ClinicBooking.Models;
using ClinicBooking.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Repositories
{
    public class PrescriptionDetailRepositiory : IPrescriptionDetailRepositiory
    {
        private readonly ApplicationDbContext _context;
        public PrescriptionDetailRepositiory(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PrescriptionDetail> Create(PrescriptionDetail prescriptionDetail)
        {
            try
            {
                await _context.PrescriptionDetails.AddAsync(prescriptionDetail);
                await _context.SaveChangesAsync();
                return prescriptionDetail;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<PrescriptionDetail> DeleteById(int PrescriptionId, int MedicineId)
        {
            try
            {
                var obj = await _context.PrescriptionDetails.AsTracking().FirstOrDefaultAsync(x => x.PrescriptionID == PrescriptionId && x.MedicineID == MedicineId);
                if (obj == null) throw new ArgumentException($"invalid Prescription id: {PrescriptionId}, medicine id: {MedicineId}");

                obj.Active = false;
                obj.Deleted = true;
                await _context.SaveChangesAsync();
                return obj;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IEnumerable<PrescriptionDetail>> GetAllAsync()
        {
            return await _context.PrescriptionDetails.ToListAsync();
        }

        public async Task<IEnumerable<PrescriptionDetail>> GetAllByPrescriptionIdAsync(int id)
        {
            return await _context.PrescriptionDetails.Where(x => x.PrescriptionID == id).ToListAsync();
        }

        

        public async Task<PrescriptionDetail> Update(int PrescriptionId, int MedicineId, PrescriptionDetail prescriptionDetail)
        {
            try
            {
                var obj = await _context.PrescriptionDetails.AsTracking().FirstOrDefaultAsync(x => x.PrescriptionID == PrescriptionId && x.MedicineID == MedicineId);
                if (obj == null) throw new ArgumentException($"invalid id: {PrescriptionId}, {MedicineId}");
                obj.Quantity = prescriptionDetail.Quantity;
                obj.Usage = prescriptionDetail.Usage;

                await _context.SaveChangesAsync();
                return obj;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<PrescriptionDetail> GetById(int PrescriptionId, int MedicineId)
        {
            return await _context.PrescriptionDetails.FindAsync(PrescriptionId, MedicineId);
        }
    }
}
