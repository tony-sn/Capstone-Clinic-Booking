using ClinicBooking.Repositories.IRepositories;
using ClinicBooking.Data;
using ClinicBooking.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Repositories;

public class MedicalHistoryRepository : IMedicalHistoryRepository
{
    private readonly ApplicationDbContext _context;

    public MedicalHistoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MedicalHistory>> GetAllAsync()
    {
        return await _context.MedicalHistories.OrderByDescending(x => x.MedicalHistoryId).ToListAsync();
    }

    public async Task<MedicalHistory?> GetById(int id)
    {
        return await _context.MedicalHistories.FindAsync(id);
    }

    public async Task<MedicalHistory> Create(MedicalHistory medicalHistory)
    {
        await _context.MedicalHistories.AddAsync(medicalHistory);
        await _context.SaveChangesAsync();
        return medicalHistory;
    }

    public async Task<MedicalHistory> Update(int id, MedicalHistory medicalHistory)
    {
        try
        {
            if (id != medicalHistory.MedicalHistoryId) throw new ArgumentException($"invalid id: ${id}");
            _context.MedicalHistories.Update(medicalHistory);
            await _context.SaveChangesAsync();
            return medicalHistory;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<MedicalHistory> DeleteById(int id)
    {
        var item = await _context.MedicalHistories.FindAsync(id);
        if (item == null) throw new ArgumentException($"invalid id: {id}");
        _context.MedicalHistories.Remove(item);
        await _context.SaveChangesAsync();
        return item;
    }
}