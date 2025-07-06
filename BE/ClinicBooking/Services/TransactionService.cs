using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _repository;
        public TransactionService(ITransactionRepository repository)
        {
            _repository = repository;
        }

        public async Task<PageResultUlt<IEnumerable<TransactionDTO>>> GetAll(int pageSize = 0, int pageNumber = 1)
        {
            if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0) throw new ArgumentException($"inlvalid page number:{pageNumber}");
            var list = await _repository.GetAllAsync();
            if (list == null) return null;
            var totalItems = list.Count();
            if (pageSize > 0)
            {
                list = list.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }
            return new PageResultUlt<IEnumerable<TransactionDTO>> 
            {
                Items = list.Select(x => TransactionDTO.ConvertToDTO(x)),
                TotalItems = totalItems
            };
        }

        public async Task<TransactionDTO> GetById(int id)
        {
            var item = await _repository.GetById(id);
            return item == null ? null : TransactionDTO.ConvertToDTO(item);
        }

        public async Task<TransactionDTO> Create(TransactionRequest transaction)
        {
            var entity = new Transaction
            {
                MedicalHistoryId = transaction.MedicalHistoryId,
                PaymentType = transaction.PaymentType,
                Paid = transaction.Paid,
                PaidDate = transaction.PaidDate
            };
            var created = await _repository.Create(entity);
            return TransactionDTO.ConvertToDTO(created);
        }

        public async Task<TransactionDTO> Update(int id, TransactionRequest transaction)
        {
            var entity = new Transaction
            {
                TransactionID = id,
                MedicalHistoryId = transaction.MedicalHistoryId,
                PaymentType = transaction.PaymentType,
                Paid = transaction.Paid,
                PaidDate = transaction.PaidDate
            };
            var updated = await _repository.Update(id, entity);
            return TransactionDTO.ConvertToDTO(updated);
        }

        public async Task<TransactionDTO> DeleteById(int id)
        {
            var deleted = await _repository.DeleteById(id);
            return TransactionDTO.ConvertToDTO(deleted);
        }
    }
}