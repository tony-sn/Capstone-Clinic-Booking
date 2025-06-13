using ClinicBooking.Data;
using ClinicBooking.Models;
using ClinicBooking.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Repositories
{
    public class PrescriptionRepository : IPrescriptionRepository
    {
        private readonly ApplicationDbContext _context;
        public PrescriptionRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Prescription> Create(Prescription prescription)
        {
            try
            {
                await _context.Prescriptions.AddAsync(prescription);
                await _context.SaveChangesAsync();
                return prescription;
            }
            catch (Exception ex) 
            {
                throw;
            }
        }

        public async Task<Prescription> DeleteById(int id)
        {
            try
            {
                var obj = await _context.Prescriptions.AsTracking().FirstOrDefaultAsync(x => x.PrescriptionID == id);
                if (obj == null) throw new ArgumentException($"invalid id: {id}");

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

        public async Task<IEnumerable<Prescription>> GetAllAsync()
        {
            return await _context.Prescriptions.ToListAsync();
        }

        public async Task<IEnumerable<Prescription>> GetAllByMedicalHistoryIdAsync(int id)
        {
            return await _context.Prescriptions.Where(x => x.MedicalHistoryID == id).ToListAsync();
        }

        public async Task<Prescription> GetById(int id)
        {
            return await _context.Prescriptions.FindAsync(id);
        }

        public async Task<Prescription> Update(int id, Prescription prescription)
        {
            try
            {
                var obj = await _context.Prescriptions.AsTracking().FirstOrDefaultAsync(x => x.PrescriptionID == id);
                if (obj == null) throw new ArgumentException($"invalid id: {id}");

                obj.MedicalHistoryID = prescription.MedicalHistoryID;
                obj.TotalAmount = prescription.TotalAmount;
                await _context.SaveChangesAsync();
                return obj;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
