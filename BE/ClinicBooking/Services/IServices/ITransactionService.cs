using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public interface ITransactionService
    {
        Task<PageResultUlt<IEnumerable<TransactionDTO>>> GetAll(int pageSize = 0, int pageNumber = 1);
        Task<TransactionDTO> GetById(int id);
        Task<TransactionDTO> Create(TransactionRequest transaction);
        Task<TransactionDTO> Update(int id, TransactionRequest transaction);
        Task<TransactionDTO> DeleteById(int id);
        Task<PageResultUlt<IEnumerable<TransactionDTO>>> GetAll(
            int pageSize,
            int pageNumber,
            bool? paid,
            PaymentType? paymentType,
            DateTime? fromDate,
            DateTime? toDate
        );
    }
}