using ClinicBooking.Data;
using ClinicBooking.Models;
using ClinicBooking.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Repositories;

public class MedicalHistoryRepository : IMedicalHistoryRepository
{
    private readonly ApplicationDbContext _context;

    public MedicalHistoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<decimal> GetAppointmentPriceByMedicalHistoryId(int medicalHistoryId)
    {
        return await _context.Appointments
            .Where(a => a.MedicalHistoryId == medicalHistoryId)
            .Select(a => a.Price ?? 0)
            .FirstOrDefaultAsync();
    }

    public async Task<decimal> GetPrescriptionTotalAmountByMedicalHistoryId(int medicalHistoryId)
    {
        var prescription = await _context.Prescriptions
            .Include(p => p.PrescriptionDetails)
            .Where(p => p.MedicalHistoryID == medicalHistoryId)
            .FirstOrDefaultAsync();

        if (prescription == null || prescription.PrescriptionDetails == null)
            return 0;

        var totalAmount = prescription.PrescriptionDetails.Sum(d => d.Amount);

        //cập nhật lại Prescription.TotalAmount trong DB
        prescription.TotalAmount = totalAmount;
        await _context.SaveChangesAsync();

        return totalAmount;
    }

    public async Task<decimal> GetTotalLaboratoryTestPriceByMedicalHistoryId(int medicalHistoryId)
    {
        return await _context.LaboratoryTestReports
            .Where(ltr => ltr.MedicalHistoryId == medicalHistoryId)
            .Include(ltr => ltr.LaboratoryTest)
            .Select(ltr => ltr.LaboratoryTest.Price)
            .SumAsync();
    }

    public async Task<IEnumerable<MedicalHistory>> GetAllAsync()
    {
        return await _context.MedicalHistories.ToListAsync();
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