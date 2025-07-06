using ClinicBooking.Data;
using ClinicBooking.Models;
using ClinicBooking.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Repositories
{
    public class MedicineRepository : IMedicineRepository
    {
        private readonly ApplicationDbContext _context;
        public MedicineRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Medicine> Create(Medicine medicine)
        {
            try
            {
                await _context.Medicines.AddAsync(medicine);
                await _context.SaveChangesAsync();
                return medicine;
            }
            catch(Exception ex) 
            {
                throw;
            }
        }

        public async Task<Medicine> DeleteById(int id)
        {
            try
            {
                var obj = await _context.Medicines.AsTracking().FirstOrDefaultAsync(x => x.MedicineID == id);
                if (obj == null)
                    throw new ArgumentException($"invalid id: {id}");
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

        public async Task<IEnumerable<Medicine>> GetAllAsync()
        {
            return await _context.Medicines.ToListAsync();
        }

        public async Task<Medicine> GetByIdAsync(int id)
        {
            return await _context.Medicines.FindAsync(id);
        }

        public async Task<Medicine> UpdateById(int id, Medicine medicine)
        {
            try
            {
                var obj = await _context.Medicines.AsTracking().FirstOrDefaultAsync(x => x.MedicineID == id);
                if (obj == null)
                    throw new ArgumentException($"invalid id: {id}");
                obj.Description = medicine.Description;
                obj.MedicineName = medicine.MedicineName;
                obj.Quantity = medicine.Quantity;
                obj.UnitPrice = medicine.UnitPrice;
                _context.Medicines.Update(obj);
                await _context.SaveChangesAsync();
                return await _context.Medicines.AsTracking().FirstOrDefaultAsync(x => x.MedicineID == id);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
