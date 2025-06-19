using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs;

public class MedicalHistoryDTO
{
    public int MedicalHistoryId { get; set; }
    public decimal TotalAmount { get; set; }
    public string Symptoms { get; set; }
    public string Diagnosis { get; set; }
    public string TreatmentInstructions { get; set; }
    public int DoctorId { get; set; }
    public int PatientId { get; set; }
    public bool Active { get; set; }

    public static MedicalHistoryDTO ConvertToDTO(MedicalHistory medicalHistory)
    {
        return new MedicalHistoryDTO
        {
            MedicalHistoryId = medicalHistory.MedicalHistoryId,
            TotalAmount = medicalHistory.TotalAmount,
            Symptoms = medicalHistory.Symptoms,
            Diagnosis = medicalHistory.Diagnosis,
            TreatmentInstructions = medicalHistory.TreatmentInstructions,
            DoctorId = medicalHistory.DoctorId,
            PatientId = medicalHistory.PatientId,
            Active = medicalHistory.Active
        };
    }
}

public class MedicalHistoryRequest
{
    [Range(0, double.MaxValue)]
    public decimal TotalAmount { get; set; }
    public string Symptoms { get; set; }
    public string Diagnosis { get; set; }
    public string TreatmentInstructions { get; set; }
    [Required]
    public int DoctorId { get; set; }
    [Required]
    public int PatientId { get; set; }
}