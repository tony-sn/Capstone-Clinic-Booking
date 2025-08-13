using ClinicBooking.Repositories.IRepositories;
using ClinicBooking.Data;
using ClinicBooking.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly ApplicationDbContext _context;

    public AppointmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Appointment>> GetAllAsync()
    {
        return await _context.Appointments
            .Include(a => a.Doctor)
            .ThenInclude(d => d.User)
            .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
            .Include(a => a.BookByUser)
            .ToListAsync();
    }

    public async Task<IEnumerable<Appointment>> GetAllAsync(AppointmentStatus? status = null, DateTime? startDate = null, DateTime? endDate = null, int? doctorId = null, int? departmentId = null, int? patientId = null)
    {
        var query = _context.Appointments
            .Include(a => a.Doctor)
                .ThenInclude(d => d.User)
            .Include(a => a.Doctor)
                .ThenInclude(d => d.Department)
            .Include(a => a.BookByUser)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(a => a.AppointmentStatus == status.Value);
        }

        if (startDate.HasValue)
        {
            query = query.Where(a => a.StartTime >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(a => a.StartTime <= endDate.Value);
        }

        if (doctorId.HasValue)
        {
            query = query.Where(a => a.DoctorId == doctorId.Value);
        }

        if (departmentId.HasValue)
        {
            query = query.Where(a => a.Doctor.DepartmentID == departmentId.Value);
        }

        if (patientId.HasValue)
        {
            query = query.Where(a => a.BookByUserID == patientId.Value);
        }

        return await query.OrderBy(a => a.StartTime).ToListAsync();
    }

    public async Task<Appointment?> GetById(int id)
    {
        return await _context.Appointments
            .Include(a => a.Doctor)
            .ThenInclude(d => d.User)
            .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
            .Include(a => a.BookByUser)
            .FirstOrDefaultAsync(a => a.AppointmentID == id);
    }

    public async Task<Appointment> Create(Appointment appointment)
    {
        await _context.Appointments.AddAsync(appointment);
        await _context.SaveChangesAsync();
        
        // Reload the appointment with related entities
        var createdAppointment = await _context.Appointments
            .Include(a => a.Doctor)
            .ThenInclude(d => d.User)
            .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
            .Include(a => a.BookByUser)
            .FirstOrDefaultAsync(a => a.AppointmentID == appointment.AppointmentID);
            
        return createdAppointment ?? appointment;
    }

    public async Task<Appointment> Update(int id, Appointment appointment)
    {
        try
        {
            if (id != appointment.AppointmentID)
                throw new ArgumentException($"invalid id: {id}");
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();
            
            // Reload the appointment with related entities
            var updatedAppointment = await _context.Appointments
                .Include(a => a.Doctor)
                .ThenInclude(d => d.User)
                .Include(a => a.Doctor)
                .ThenInclude(d => d.Department)
                .Include(a => a.BookByUser)
                .FirstOrDefaultAsync(a => a.AppointmentID == id);
                
            return updatedAppointment ?? appointment;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<Appointment> DeleteById(int id)
    {
        var item = await _context.Appointments
            .Include(a => a.Doctor)
            .ThenInclude(d => d.User)
            .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
            .Include(a => a.BookByUser)
            .FirstOrDefaultAsync(a => a.AppointmentID == id);
        if (item == null) throw new ArgumentException($"invalid id: {id}");
        item.Active = false;
        await _context.SaveChangesAsync();
        return item;
    }
}