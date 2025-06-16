namespace ClinicBooking.Services.IServices
{

    using ClinicBooking.Models.DTOs;

    using ClinicBooking_Utility;
    using System.Threading.Tasks;

    public interface IImageService
    {
        Task<ImageDTO> CreateImageAsync(CreateImageRequest request);
        Task<ImageDTO> GetImageByIdAsync(int imageId);
        Task<ImageDTO> UpdateImageAsync(int id, UpdateImageRequest request);
        Task<PageResultUlt<IEnumerable<ImageDTO>>> GetAllImagesAsync(int pageSize, int pageNumber);
        Task<ImageDTO> DeleteImageAsync(int imageId);
    }
}