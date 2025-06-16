using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs
{
    public class TransactionDTO
    {
        public int Id { get; set; }
        public int MedicalHistoryId { get; set; }
        public PaymentType PaymentType { get; set; }
        public bool Paid { get; set; }
        public DateTime? PaidDate { get; set; }
        public bool Active { get; set; }

        public static TransactionDTO ConvertToDTO(Transaction transaction)
        {
            return new TransactionDTO
            {
                Id = transaction.TransactionID,
                MedicalHistoryId = transaction.MedicalHistoryId,
                PaymentType = transaction.PaymentType,
                Paid = transaction.Paid,
                PaidDate = transaction.PaidDate,
                Active = transaction.Active
            };
        }
    }

    public class TransactionRequest
    {
        [Required]
        public int MedicalHistoryId { get; set; }
        [Required]
        public PaymentType PaymentType { get; set; }
        public bool Paid { get; set; }
        public DateTime? PaidDate { get; set; }
    }
}