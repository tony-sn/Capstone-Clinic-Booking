using ClinicBooking_Utility;
using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking.Services.IServices;

namespace ClinicBooking.Services
{
    public class MedicalHistoryService : IMedicalHistoryService
    {
        private readonly IMedicalHistoryRepository _repository;

        public MedicalHistoryService(IMedicalHistoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<PageResultUlt<IEnumerable<MedicalHistoryDTO>>> GetAll(int pageSize = 0, int pageNumber = 1)
        {
            if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
            if (pageNumber <= 0) throw new ArgumentException($"inlvalid page number:{pageNumber}");
            var list = await _repository.GetAllAsync();
            if (list == null) return null;
            var totalItems = list.Count();
            if (pageSize > 0)
            {
                list = list.Skip((1 - pageNumber) * pageSize).Take(pageSize).ToList();
            }

            return new PageResultUlt<IEnumerable<MedicalHistoryDTO>>
            {
                Items = list.Select(x => MedicalHistoryDTO.ConvertToDTO(x)),
                TotalItems = totalItems
            };
        }

        public async Task<MedicalHistoryDTO> GetById(int id)
        {
            var item = await _repository.GetById(id);
            return item == null ? null : MedicalHistoryDTO.ConvertToDTO(item);
        }

        public async Task<MedicalHistoryDTO> Create(MedicalHistoryRequest request)
        {
            var entity = new MedicalHistory
            {
                TotalAmount = request.TotalAmount,  
                Symptoms = request.Symptoms,
                Diagnosis = request.Diagnosis,
                TreatmentInstructions = request.TreatmentInstructions,
                DoctorId = request.DoctorId,
                PatientId = request.PatientId,
                Doctor = null,
                Patient = null
            };
            var created = await _repository.Create(entity);
            return MedicalHistoryDTO.ConvertToDTO(created);
        }

        public async Task<MedicalHistoryDTO> Update(int id, MedicalHistoryRequest request)
        {
            var entity = new MedicalHistory
            {
                MedicalHistoryId = id,
                TotalAmount = request.TotalAmount,
                Symptoms = request.Symptoms,
                Diagnosis = request.Diagnosis,
                TreatmentInstructions = request.TreatmentInstructions,
                DoctorId = request.DoctorId,
                PatientId = request.PatientId,
                Doctor = null,
                Patient = null,
            };
            var updated = await _repository.Update(id, entity);
            return MedicalHistoryDTO.ConvertToDTO(updated);
        }

        public async Task<MedicalHistoryDTO> DeleteById(int id)
        {
            var deleted = await _repository.DeleteById(id);
            return MedicalHistoryDTO.ConvertToDTO(deleted);
        }
    }
}