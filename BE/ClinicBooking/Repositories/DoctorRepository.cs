namespace ClinicBooking.Repositories
{
    using ClinicBooking.Data;
    using ClinicBooking.Models;
    using ClinicBooking.Repositories.IRepositories;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class DoctorRepository : IDoctorRepository
    {
        private readonly ApplicationDbContext _context;
        public DoctorRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Doctor>> GetAllDoctorsAsync(int? deparmentID)
        {
            var doctors = _context.Doctors.AsQueryable();

            if (deparmentID != null)
            {
                doctors = doctors.Where(x => x.DepartmentID == deparmentID);
            }
            doctors = doctors.Include(x => x.User).Include(x => x.Department);

            return await doctors.ToListAsync();
        }

        public async Task<Doctor> GetById(int id)
        {
            return await _context.Doctors.Include(x => x.User).Include(x => x.Department).FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<Doctor> Create(Doctor doctor)
        {
            try
            {
                await _context.Doctors.AddAsync(doctor);
                await _context.SaveChangesAsync();
                return doctor;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<Doctor> Update(int id, Doctor doctor)
        {
            try
            {
                var item = await _context.Doctors.AsTracking().FirstOrDefaultAsync(x => x.Id == id);
                if (item == null) throw new ArgumentException($"invalid id: {id}");
                item.Certificate = doctor.Certificate;
                item.DepartmentID = doctor.DepartmentID;
                item.UserId = doctor.UserId;
                _context.Doctors.Update(item);
                await _context.SaveChangesAsync();
                return await _context.Doctors.AsTracking().FirstOrDefaultAsync(x => x.Id == id);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<Doctor> DeleteById(int id)
        {
            try
            {
                var item = await _context.Doctors.AsTracking().FirstOrDefaultAsync(x => x.Id == id);
                if (item == null) throw new ArgumentException($"invalid id: {id}");
                item.Active = false;
                await _context.SaveChangesAsync();
                return await _context.Doctors.AsTracking().FirstOrDefaultAsync(x => x.Id == id);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}