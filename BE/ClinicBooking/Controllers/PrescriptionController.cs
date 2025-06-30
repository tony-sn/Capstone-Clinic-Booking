using ClinicBooking.Models.DTOs;
using ClinicBooking.Services;
using ClinicBooking.Services.IServices;
using ClinicBooking_Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : ControllerBase
    {
        private readonly IPrescriptionService _prescriptionService;
        public PrescriptionController(IPrescriptionService prescriptionService)
        {
            _prescriptionService = prescriptionService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<PrescriptionDTO>>>> GetAll(int pageSize = 5, int pageNumber = 1)
        {
            var result = await _prescriptionService.GetAll(pageSize, pageNumber);
            if (result == null) return NotFound();

            return Ok(new ApiResponseWithPagination<IEnumerable<PrescriptionDTO>>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result.Items,
                Pagination = new Pagination
                {
                    PageSize = pageSize,
                    PageNumber = pageNumber,
                    TotalItems = result.TotalItems
                }
            });
        }
        [HttpGet("GetByMedicalHistoryId/{id:int}")]
        public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<PrescriptionDTO>>>> GetAllByMedicalHistoryId(int id,int pageSize = 5, int pageNumber = 1)
        {
            var result = await _prescriptionService.GetAllByMedicalHistoryId(id, pageSize, pageNumber);
            if (result == null) return NotFound();

            return Ok(new ApiResponseWithPagination<IEnumerable<PrescriptionDTO>>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result.Items,
                Pagination = new Pagination
                {
                    PageSize = pageSize,
                    PageNumber = pageNumber,
                    TotalItems = result.TotalItems
                }
            });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<PrescriptionDTO>>> GetById(int id)
        {
            var result = await _prescriptionService.GetById(id);
            return Ok(new ApiResponse<PrescriptionDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<PrescriptionDTO>>> Create([FromForm] PrescriptionRequest request)
        {
            var result = await _prescriptionService.Create(request);
            return Ok(new ApiResponse<PrescriptionDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result
            });
        }

        [HttpPut("DeleteById/{id:int}")]
        public async Task<ActionResult<ApiResponse<PrescriptionDTO>>> DeleteById(int id)
        {
            var result = await _prescriptionService.DeleteById(id);
            return Ok(
                new ApiResponse<PrescriptionDTO>
                {
                    Status = Constants.SUCCESS_UPDATE_CODE,
                    Message = Constants.SUCCESS_UPDATE_MSG,
                    Data = result
                }
            );
        }

    }
}
