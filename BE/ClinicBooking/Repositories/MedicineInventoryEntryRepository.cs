using ClinicBooking.Data;
using ClinicBooking.Models;
using ClinicBooking.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Repositories
{
    public class MedicineInventoryEntryRepository : IMedicineInventoryEntryRepository
    {
        private readonly ApplicationDbContext _context;
        public MedicineInventoryEntryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MedicineInventoryEntry> Create(MedicineInventoryEntry medicineInventoryEntry)
        {
            try
            {
                medicineInventoryEntry.Timestamp = DateTime.Now;
                await _context.MedicineInventoryEntries.AddAsync(medicineInventoryEntry);
                await _context.SaveChangesAsync();
                return medicineInventoryEntry;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<MedicineInventoryEntry> DeleteById(int id)
        {
            try
            {
                var obj = await _context.MedicineInventoryEntries.AsTracking().FirstOrDefaultAsync(x => x.Id == id);
                if (obj == null)
                    throw new ArgumentException($"invalid id: {id}");
                obj.Active = false;
                obj.Deleted = true;
                await _context.SaveChangesAsync();
                return obj;
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public async Task<IEnumerable<MedicineInventoryEntry>> GetAllAsync()
        {
            return await _context.MedicineInventoryEntries.ToListAsync();
        }

        public async Task<MedicineInventoryEntry> GetByIdAsync(int id)
        {
            return await _context.MedicineInventoryEntries.FindAsync(id);
        }

        public async Task<MedicineInventoryEntry> UpdateById(int id, MedicineInventoryEntry medicineInventoryEntry)
        {
            try
            {
                var obj = await _context.MedicineInventoryEntries.AsTracking().FirstOrDefaultAsync(x => x.Id == id);
                if (obj == null)
                    throw new ArgumentException($"invalid id: {id}");
                obj.MedicineID = medicineInventoryEntry.MedicineID;
                obj.ChangeType = medicineInventoryEntry.ChangeType;
                obj.Quantity = medicineInventoryEntry.Quantity;
                obj.CompanyName = medicineInventoryEntry.CompanyName;
                obj.Note = medicineInventoryEntry.Note;
                obj.PrescriptionID = medicineInventoryEntry.PrescriptionID;
                await _context.SaveChangesAsync();
                return await _context.MedicineInventoryEntries.AsTracking().FirstOrDefaultAsync(x => x.Id == id);

            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
