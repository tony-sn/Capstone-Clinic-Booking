using ClinicBooking.Models;

namespace ClinicBooking.Repositories.IRepositories
{


    public interface IDepartmentRepository
    {
        Task<IEnumerable<Department>> GetAllDepartmentsAsync();
        Task<Department> GetById(int id);

        Task<Department> Create(Department department);
        Task<Department> Update(int id, Department department);
        Task<Department> DeleteById(int id);
    }
}