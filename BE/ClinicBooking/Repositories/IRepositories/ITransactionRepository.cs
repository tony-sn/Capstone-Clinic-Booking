using ClinicBooking.Models;

namespace ClinicBooking.Repositories.IRepositories;

public interface ITransactionRepository
{
    Task<IEnumerable<Transaction>> GetAllAsync();
    Task<Transaction?> GetById(int id);
    Task<Transaction> Create(Transaction transaction);
    Task<Transaction> Update(int id, Transaction transaction);
    Task<Transaction> DeleteById(int id);
    Task<IEnumerable<Transaction>> GetFilteredAsync(bool? paid, PaymentType? paymentType, DateTime? fromDate, DateTime? toDate);
}