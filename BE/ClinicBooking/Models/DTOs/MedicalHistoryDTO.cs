using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Models.DTOs;

public class MedicalHistoryDTO
{
    public int Id { get; set; }
    public decimal Price { get; set; }
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
            Id = medicalHistory.MedicalHistoryId,
            Price = medicalHistory.Price,
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
    public decimal Price { get; set; }
    public string Symptoms { get; set; }
    public string Diagnosis { get; set; }
    public string TreatmentInstructions { get; set; }
    [Required]
    public int DoctorId { get; set; }
    [Required]
    public int PatientId { get; set; }
}