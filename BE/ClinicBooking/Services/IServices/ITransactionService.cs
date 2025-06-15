using ClinicBooking.Models.DTOs;

namespace ClinicBooking.Services
{
    public interface ITransactionService
    {
        Task<IEnumerable<TransactionDTO>> GetAll();
        Task<TransactionDTO> GetById(int id);
        Task<TransactionDTO> Create(TransactionRequest transaction);
        Task<TransactionDTO> Update(int id, TransactionRequest transaction);
        Task<TransactionDTO> DeleteById(int id);
    }
}