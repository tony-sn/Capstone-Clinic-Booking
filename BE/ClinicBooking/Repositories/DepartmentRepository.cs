namespace ClinicBooking.Repositories
{
    using ClinicBooking.Data;
    using ClinicBooking.Models;
    using ClinicBooking.Repositories.IRepositories;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly ApplicationDbContext _context;
        public DepartmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Department>> GetAllDepartmentsAsync()
        {
            return await _context.Departments.ToListAsync();
        }

        public async Task<Department> GetById(int id)
        {
            return await _context.Departments.FindAsync(id);
        }
        public async Task<Department> Create(Department department)
        {
            try
            {
                await _context.Departments.AddAsync(department);
                await _context.SaveChangesAsync();
                return department;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<Department> Update(int id, Department department)
        {
            try
            {
                var item = await _context.Departments.AsTracking().FirstOrDefaultAsync(x => x.DepartmentID == id);
                if (item == null) throw new ArgumentException($"invalid id: {id}");
                item.DepartmentName = department.DepartmentName;
                _context.Departments.Update(item);
                await _context.SaveChangesAsync();
                return await _context.Departments.AsTracking().FirstOrDefaultAsync(x => x.DepartmentID == id);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<Department> DeleteById(int id)
        {
            try
            {
                var item = await _context.Departments.AsTracking().FirstOrDefaultAsync(x => x.DepartmentID == id);
                if (item == null) throw new ArgumentException($"invalid id: {id}");
                item.Active = false;
                await _context.SaveChangesAsync();
                return await _context.Departments.AsTracking().FirstOrDefaultAsync(x => x.DepartmentID == id);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}