using ClinicBooking.Models.DTOs;
using ClinicBooking_Utility;
using ClinicBooking.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _service;

        public AppointmentController(IAppointmentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<AppointmentDTO>>>> GetAll(int pageSize = 5, int pageNumber = 1)
        {
            var result = await _service.GetAll(pageSize: pageSize, pageNumber: pageNumber);
            if (result == null) return NotFound();
            return Ok(new ApiResponseWithPagination<IEnumerable<AppointmentDTO>>
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
        public async Task<ActionResult<ApiResponse<AppointmentDTO>>> GetById(int id)
        {
            var item = await _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(new ApiResponse<AppointmentDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = item
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<AppointmentDTO>>> Create([FromForm] AppointmentRequest request)
        {
            var created = await _service.Create(request);
            return Ok(new ApiResponse<AppointmentDTO>
            {
                Status = Constants.SUCCESS_CREATE_CODE,
                Message = Constants.SUCCESS_CREATE_MSG,
                Data = created
            });
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<AppointmentDTO>>> Update(int id,
            [FromForm] AppointmentRequest request)
        {
            var updated = await _service.Update(id, request);
            return Ok(new ApiResponse<AppointmentDTO>
            {
                Status = Constants.SUCCESS_UPDATE_CODE,
                Message = Constants.SUCCESS_UPDATE_MSG,
                Data = updated
            });
        }

        [HttpPut("DeleteById/{id:int}")]
        public async Task<ActionResult<ApiResponse<AppointmentDTO>>> DeleteById(int id)
        {
            var deleted = await _service.DeleteById(id);
            return Ok(new ApiResponse<AppointmentDTO>
            {
                Status = Constants.SUCCESS_DELETE_CODE,
                Message = Constants.SUCCESS_DELETE_MSG,
                Data = deleted
            });
        }
    }
}