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
            .Include(a => a.BookByUser)
            .ToListAsync();
    }

    public async Task<Appointment?> GetById(int id)
    {
        return await _context.Appointments
            .Include(a => a.Doctor)
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
            .Include(a => a.BookByUser)
            .FirstOrDefaultAsync(a => a.AppointmentID == id);
        if (item == null) throw new ArgumentException($"invalid id: {id}");
        item.Active = false;
        await _context.SaveChangesAsync();
        return item;
    }
}