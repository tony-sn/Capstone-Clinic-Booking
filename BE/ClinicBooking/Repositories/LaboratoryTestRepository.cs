namespace ClinicBooking.Repositories
{
    using ClinicBooking.Data;
    using ClinicBooking.Models;
    using ClinicBooking.Models.DTOs;
    using ClinicBooking.Repositories.IRepositories;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class LaboratoryTestRepository : ILaboratoryTestRepository
    {
        private readonly ApplicationDbContext _context;
        public LaboratoryTestRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<LaboratoryTest>> GetAllLaboratoryTestsAsync()
        {
            return await _context.LaboratoryTests.ToListAsync();
        }

        public async Task<LaboratoryTest> GetById(int id)
        {
            return await _context.LaboratoryTests.FindAsync((int)id);
        }
        public async Task<LaboratoryTest> Create(LaboratoryTest laboratoryTest)
        {
            try
            {
                await _context.LaboratoryTests.AddAsync(laboratoryTest);
                await _context.SaveChangesAsync();
                return laboratoryTest;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<LaboratoryTest> Update(int id, LaboratoryTest laboratoryTest)
        {
            try
            {
                var item = await _context.LaboratoryTests.AsTracking().FirstOrDefaultAsync(x => x.LaboratoryTestId == id);
                if (item == null) throw new ArgumentException($"invalid id: {id}");
                item.Name = laboratoryTest.Name;
                item.Description = laboratoryTest.Description;
                item.Price = laboratoryTest.Price;
                item.Active = laboratoryTest.Active;
                _context.LaboratoryTests.Update(item);
                await _context.SaveChangesAsync();
                return await _context.LaboratoryTests.AsTracking().FirstOrDefaultAsync(x => x.LaboratoryTestId == id);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<LaboratoryTest> DeleteById(int id)
        {
            try
            {
                var item = await _context.LaboratoryTests.AsTracking().FirstOrDefaultAsync(x => x.LaboratoryTestId == id);
                if (item == null) throw new ArgumentException($"invalid id: {id}");
                item.Active = false;
                await _context.SaveChangesAsync();
                return await _context.LaboratoryTests.AsTracking().FirstOrDefaultAsync(x => x.LaboratoryTestId == id);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}