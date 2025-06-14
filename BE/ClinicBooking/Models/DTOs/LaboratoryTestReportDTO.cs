using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace ClinicBooking.Models.DTOs
{
    public class LaboratoryTestReportDTO
    {
        public int MedicalHistoryId { get; set; }
        public int LaboratoryTestId { get; set; }
        public string Result { get; set; }
        public bool Active { get; set; }
        public UserDTO Technician { get; set; }
        public static LaboratoryTestReportDTO ConvertToLaboratoryTestReportDTO(LaboratoryTestReport laboratoryTestReport)
        {
            return new LaboratoryTestReportDTO
            {
                MedicalHistoryId = laboratoryTestReport.MedicalHistoryId,
                LaboratoryTestId = laboratoryTestReport.LaboratoryTestId,
                Result = laboratoryTestReport.Result,
                Active = laboratoryTestReport.Active,
                Technician = (laboratoryTestReport.Technician != null) ? UserDTO.ConvertToUserDTO(laboratoryTestReport.Technician) : null
            };
        }
    }

    public class LaboratoryTestReportFilter
    {
        [AllowNull]
        public string? Result { get; set; }
        public int PageSize { get; set; } = 0;
        public int PageNumber { get; set; } = 1;
    }

    public class CreateLaboratoryTestReportRequest
    {
        [Required]
        public int MedicalHistoryId { get; set; }
        [Required]
        public int LaboratoryTestId { get; set; }
        [Required]
        public string Result { get; set; }
        [Required]
        public int TechnicianId { get; set; }

    }
    public class UpdateLaboratoryTestReportRequest
    {
        [Required]
        public int MedicalHistoryId { get; set; }
        [Required]
        public int LaboratoryTestId { get; set; }
        [Required]
        public string Result { get; set; }
        [Required]
        public int TechnicianId { get; set; }
        public bool Status { get; set; } = true;

    }
}