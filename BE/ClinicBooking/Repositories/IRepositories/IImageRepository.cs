namespace ClinicBooking.Repositories.IRepositories
{
    using ClinicBooking.Models;
    using ClinicBooking.Models.DTOs;
    using ClinicBooking_Utility;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IImageRepository
    {
        Task<Image> CreateImageAsync(CreateImageRequest request);
        Task<Image> UpdateImageAsync(int id, UpdateImageRequest request);
        Task<Image> DeleteImageAsync(int imageId);
        Task<Image> GetImageByIdAsync(int imageId);
        Task<PageResultUlt<IEnumerable<Image>>> GetAllImagesAsync(int pageSize, int pageNumber);
    }
}