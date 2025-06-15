using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;

namespace ClinicBooking.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _repository;
        public TransactionService(ITransactionRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TransactionDTO>> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return list.Select(TransactionDTO.ConvertToDTO);
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