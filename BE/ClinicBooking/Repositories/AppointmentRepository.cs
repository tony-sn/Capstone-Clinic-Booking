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
        return await _context.Appointments.ToListAsync();
    }

    public async Task<Appointment?> GetById(int id)
    {
        return await _context.Appointments.FindAsync(id);
    }

    public async Task<Appointment> Create(Appointment appointment)
    {
        await _context.Appointments.AddAsync(appointment);
        await _context.SaveChangesAsync();
        return appointment;
    }

    public async Task<Appointment> Update(int id, Appointment appointment)
    {
        try
        {
            if (id != appointment.AppointmentID)
                throw new ArgumentException($"invalid id: {id}");
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<Appointment> DeleteById(int id)
    {
        var item = await _context.Appointments.FindAsync(id);
        if (item == null) throw new ArgumentException($"invalid id: {id}");
        item.Active = false;
        await _context.SaveChangesAsync();
        return item;
    }
}