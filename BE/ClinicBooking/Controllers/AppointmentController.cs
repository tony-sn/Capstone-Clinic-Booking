using ClinicBooking.Models.DTOs;
using ClinicBooking.Services;
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
        public async Task<ActionResult<ApiResponse<IEnumerable<AppointmentDTO>>>> GetAll()
        {
            var result = await _service.GetAll();
            return Ok(new ApiResponse<IEnumerable<AppointmentDTO>>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<AppointmentDTO>>> Get(int id)
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
        public async Task<ActionResult<ApiResponse<AppointmentDTO>>> Post([FromBody] AppointmentRequest appointment)
        {
            var created = await _service.Create(appointment);
            return Ok(new ApiResponse<AppointmentDTO>
            {
                Status = Constants.SUCCESS_CREATE_CODE,
                Message = Constants.SUCCESS_CREATE_MSG,
                Data = created
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<AppointmentDTO>>> Put(int id,
            [FromBody] AppointmentRequest appointment)
        {
            var updated = await _service.Update(id, appointment);
            return Ok(new ApiResponse<AppointmentDTO>
            {
                Status = Constants.SUCCESS_UPDATE_CODE,
                Message = Constants.SUCCESS_UPDATE_MSG,
                Data = updated
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<AppointmentDTO>>> Delete(int id)
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