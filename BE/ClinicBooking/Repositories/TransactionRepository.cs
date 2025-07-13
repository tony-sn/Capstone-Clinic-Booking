using ClinicBooking.Data;
using ClinicBooking.Models;
using ClinicBooking.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ApplicationDbContext _context;
        public TransactionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Transaction>> GetAllAsync()
        {
            return await _context.Transactions.ToListAsync();
        }

        public async Task<Transaction?> GetById(int id)
        {
            return await _context.Transactions.FindAsync(id);
        }

        public async Task<Transaction> Create(Transaction transaction)
        {
            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<Transaction> Update(int id, Transaction transaction)
        {
            if (id != transaction.TransactionID)
                throw new ArgumentException($"invalid id: {id}");
            _context.Transactions.Update(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<Transaction> DeleteById(int id)
        {
            var item = await _context.Transactions.FindAsync(id);
            if (item == null) throw new ArgumentException($"invalid id: {id}");
            _context.Transactions.Remove(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<IEnumerable<Transaction>> GetFilteredAsync(bool? paid, PaymentType? paymentType, DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.Transactions.AsQueryable();
            if (paid.HasValue)
            {
                query = query.Where(t => t.Paid == paid.Value);
            }

            if (paymentType.HasValue)
            {
                query = query.Where(t => t.PaymentType == paymentType.Value);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(t => t.PaidDate >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(t => t.PaidDate <= toDate.Value);
            }

            return await query.ToListAsync();
        }
    }
}