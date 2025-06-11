using ClinicBooking.Models.DTOs;
using ClinicBooking.Services.IServices;
using ClinicBooking_Utility;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;
        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PageResultUlt<IEnumerable<ImageDTO>>>>> GetAllImagesAsync(int pageSize = 10, int pageNumber = 1)
        {
            var result = await _imageService.GetAllImagesAsync(pageSize, pageNumber);
            if (result == null || result.Items == null || !result.Items.Any())
            {
                return NotFound(new ApiResponse<PageResultUlt<IEnumerable<ImageDTO>>>
                {
                    Status = Constants.SUCCESS_READ_CODE,
                    Message = Constants.SUCCESS_READ_MSG,
                    Data = new PageResultUlt<IEnumerable<ImageDTO>>
                    {
                        Items = new List<ImageDTO>(),
                        TotalItems = 0
                    }
                });
            }
            return Ok(new ApiResponse<PageResultUlt<IEnumerable<ImageDTO>>>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result
            });
        }
        [HttpGet("{imageId:int}")]
        public async Task<ActionResult<ApiResponse<ImageDTO>>> GetImageByIdAsync(int imageId)
        {
            var result = await _imageService.GetImageByIdAsync(imageId);
            if (result == null)
            {
                return NotFound(new ApiResponse<ImageDTO>
                {
                    Status = Constants.FAIL_READ_CODE,
                    Message = Constants.FAIL_READ_MSG,
                    Data = null
                });
            }
            return Ok(new ApiResponse<ImageDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result
            });
        }

        [HttpPost("CreateImage")]
        public async Task<ActionResult<ApiResponse<ImageDTO>>> CreateImageAsync([FromForm] CreateImageRequest request)
        {
            if (request == null)
            {
                return BadRequest("CreateImageRequest cannot be null");
            }

            var result = await _imageService.CreateImageAsync(request);

            return Ok(new ApiResponse<ImageDTO>
            {
                Status = Constants.SUCCESS_CREATE_CODE,
                Message = Constants.SUCCESS_CREATE_MSG,
                Data = result
            });
        }
        [HttpPut("{imageId:int}")]
        public async Task<ActionResult<ApiResponse<ImageDTO>>> Update(int imageId, [FromForm] UpdateImageRequest request)
        {
            var result = await _imageService.UpdateImageAsync(imageId, request);
            return Ok(new ApiResponse<ImageDTO>
            {
                Status = Constants.SUCCESS_UPDATE_CODE,
                Message = Constants.SUCCESS_UPDATE_MSG,
                Data = result
            });
        }
    }
}