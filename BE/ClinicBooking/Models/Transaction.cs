using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models
{
    public class Transaction : EntityBase
    {
        public int TransactionID { get; set; }
        public int MedicalHistoryId { get; set; }
        public MedicalHistory MedicalHistory { get; set; }

        [Required]
        public PaymentType PaymentType { get; set; }

        public bool Paid { get; set; }
        public DateTime? PaidDate { get; set; }
    }

    public enum PaymentType
    {
        Cash,
        Card,
        BankTransfer
    }
}
