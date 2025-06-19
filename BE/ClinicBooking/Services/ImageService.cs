using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking.Services.IServices;
using ClinicBooking_Utility;

namespace ClinicBooking.Services
{
    public class ImageService : IImageService
    {
        private readonly IImageRepository _imageRepository;
        public ImageService(IImageRepository imageRepository)
        {
            _imageRepository = imageRepository;
        }
        public async Task<ImageDTO> CreateImageAsync(CreateImageRequest request)
        {
            var result = await _imageRepository.CreateImageAsync(request);
            return (result != null) ? ImageDTO.ConvertToImageDTO(result) : null;
        }

        public async Task<ImageDTO> DeleteImageAsync(int imageId)
        {
            var result = await _imageRepository.DeleteImageAsync(imageId);
            if (result == null)
            {
                throw new ArgumentException($"Image with ID {imageId} not found.");
            }
            return ImageDTO.ConvertToImageDTO(result);

        }

        public async Task<PageResultUlt<IEnumerable<ImageDTO>>> GetAllImagesAsync(int pageSize, int pageNumber)
        {
            var result = await _imageRepository.GetAllImagesAsync(pageSize, pageNumber);
            if (result == null || result.Items == null)
            {
                return new PageResultUlt<IEnumerable<ImageDTO>>
                {
                    Items = new List<ImageDTO>(),
                    TotalItems = 0
                };
            }
            return new PageResultUlt<IEnumerable<ImageDTO>>
            {
                Items = result.Items.Select(ImageDTO.ConvertToImageDTO),
                TotalItems = result.TotalItems
            };
        }

        public async Task<ImageDTO> GetImageByIdAsync(int imageId)
        {
            var result = await _imageRepository.GetImageByIdAsync(imageId);
            if (result == null)
            {
                throw new ArgumentException($"Image with ID {imageId} not found.");
            }
            return ImageDTO.ConvertToImageDTO(result);
        }

        public async Task<ImageDTO> UpdateImageAsync(int id, UpdateImageRequest request)
        {
            var result = await _imageRepository.UpdateImageAsync(id, request);
            if (result == null)
            {
                throw new ArgumentException($"Image with ID {id} not found.");
            }
            return ImageDTO.ConvertToImageDTO(result);
        }
    }
}