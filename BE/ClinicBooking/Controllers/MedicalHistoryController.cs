using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;
using ClinicBooking.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalHistoryController : ControllerBase
    {
        private readonly IMedicalHistoryService _service;

        public MedicalHistoryController(IMedicalHistoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<MedicalHistoryDTO>>>> GetAll(int pageSize = 5, int pageNumber = 1)
        {
            var result = await _service.GetAll(pageSize: pageSize, pageNumber: pageNumber);
            if (result == null) return NotFound();
            return Ok(new ApiResponseWithPagination<IEnumerable<MedicalHistoryDTO>>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result.Items,
                Pagination = new Pagination
                {
                    PageSize =pageSize,
                    PageNumber = pageNumber,
                    TotalItems = result.TotalItems
                }
            });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<MedicalHistoryDTO>>> GetById(int id)
        {
            var item = await _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(new ApiResponse<MedicalHistoryDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = item
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<MedicalHistoryDTO>>> Create([FromBody] MedicalHistoryRequest request)
        {
            var created = await _service.Create(request);
            return Ok(new ApiResponse<MedicalHistoryDTO>
            {
                Status = Constants.SUCCESS_CREATE_CODE,
                Message = Constants.SUCCESS_CREATE_MSG,
                Data = created
            });
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<MedicalHistoryDTO>>> Update(int id,
            [FromForm] MedicalHistoryRequest request)
        {
            var updated = await _service.Update(id, request);
            return Ok(new ApiResponse<MedicalHistoryDTO>
            {
                Status = Constants.SUCCESS_UPDATE_CODE,
                Message = Constants.SUCCESS_UPDATE_MSG,
                Data = updated
            });
        }

        [HttpPut("DeleteById/{id:int}")]
        public async Task<ActionResult<ApiResponse<MedicalHistoryDTO>>> Delete(int id)
        {
            var deleted = await _service.DeleteById(id);
            return Ok(new ApiResponse<MedicalHistoryDTO>
            {
                Status = Constants.SUCCESS_DELETE_CODE,
                Message = Constants.SUCCESS_DELETE_MSG,
                Data = deleted
            });
        }
    }
}